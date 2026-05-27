package com.school.admin.config;

import com.school.admin.model.SchoolClass;
import com.school.admin.model.Section;
import com.school.admin.model.Student;
import com.school.admin.model.Subject;
import com.school.admin.model.User;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SectionRepository;
import com.school.admin.repository.StudentRepository;
import com.school.admin.repository.SubjectRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedUsers();
        seedClasses();
        seedStudents();
    }

    private void seedUsers() {
        List<Object[]> users = List.of(
            new Object[]{"admin",     "System Admin",     "admin@school.edu",     User.Role.ADMIN},
            new Object[]{"principal", "Dr. R. Sharma",    "principal@school.edu", User.Role.PRINCIPAL},
            new Object[]{"teacher1",  "Mrs. Priya Mehta", "teacher1@school.edu",  User.Role.TEACHER},
            new Object[]{"teacher2",  "Mr. Arjun Patel",  "teacher2@school.edu",  User.Role.TEACHER},
            new Object[]{"clerk1",    "Ms. Sunita Roy",   "clerk1@school.edu",    User.Role.CLERK}
        );

        String encoded = passwordEncoder.encode("password");

        for (Object[] u : users) {
            String username = (String) u[0];
            userRepository.findByUsername(username).ifPresentOrElse(
                existing -> {
                    // Always fix the password in case it was seeded with a bad hash
                    existing.setPassword(encoded);
                    userRepository.save(existing);
                },
                () -> userRepository.save(User.builder()
                    .username(username)
                    .password(encoded)
                    .fullName((String) u[1])
                    .email((String) u[2])
                    .role((User.Role) u[3])
                    .active(true)
                    .build())
            );
        }
    }

    private void seedClasses() {
        // Class name → list of [subjectName, subjectCode] pairs
        Map<String, List<String[]>> classSubjects = Map.of(
            "Class 1",  List.of(new String[]{"Mathematics","MATH01"}, new String[]{"English","ENG01"}, new String[]{"Science","SCI01"}, new String[]{"EVS","EVS01"}),
            "Class 2",  List.of(new String[]{"Mathematics","MATH02"}, new String[]{"English","ENG02"}, new String[]{"Science","SCI02"}, new String[]{"EVS","EVS02"}),
            "Class 5",  List.of(new String[]{"Mathematics","MATH05"}, new String[]{"English","ENG05"}, new String[]{"Science","SCI05"}, new String[]{"Social Studies","SST05"}),
            "Class 9",  List.of(new String[]{"Mathematics","MATH09"}, new String[]{"English","ENG09"}, new String[]{"Physics","PHY09"}, new String[]{"Chemistry","CHE09"}, new String[]{"Biology","BIO09"}, new String[]{"History","HIS09"}),
            "Class 10", List.of(new String[]{"Mathematics","MATH10"}, new String[]{"English","ENG10"}, new String[]{"Physics","PHY10"}, new String[]{"Chemistry","CHE10"}, new String[]{"Biology","BIO10"}, new String[]{"History","HIS10"})
        );

        for (int i = 1; i <= 10; i++) {
            String className = "Class " + i;
            SchoolClass sc = classRepository.findByClassName(className).orElseGet(() ->
                classRepository.save(SchoolClass.builder().className(className).build())
            );

            for (String sectionName : List.of("A", "B")) {
                boolean exists = sectionRepository.findBySchoolClassId(sc.getId())
                    .stream().anyMatch(s -> s.getName().equals(sectionName));
                if (!exists) {
                    sectionRepository.save(Section.builder().name(sectionName).schoolClass(sc).build());
                }
            }

            List<String[]> subjects = classSubjects.get(className);
            if (subjects != null) {
                for (String[] sub : subjects) {
                    boolean exists = subjectRepository.findBySchoolClassId(sc.getId())
                        .stream().anyMatch(s -> s.getCode().equals(sub[1]));
                    if (!exists) {
                        subjectRepository.save(Subject.builder().name(sub[0]).code(sub[1]).schoolClass(sc).build());
                    }
                }
            }
        }
    }

    private void seedStudents() {
        // Seed demo student records only if none exist yet
        if (studentRepository.count() == 0) {
            List<Student> studentsToAdd = new java.util.ArrayList<>();
            String[] firstNames = {"Rahul","Priya","Aditya","Sneha","Vikram","Anjali","Rohan","Pooja","Arjun","Divya","Nikhil","Isha","Sanjay","Neha","Karan"};
            String[] lastNames = {"Sharma","Patel","Kumar","Gupta","Singh","Desai","Reddy","Verma","Joshi","Nair","Iyer","Bhat","Rao","Mishra","Pandey"};
            String[] cities = {"Mumbai","Pune","Nagpur","Nashik","Delhi","Bangalore"};
            String[] bloodGroups = {"O+","O-","A+","A-","B+","B-","AB+","AB-"};

            int admNo = 26001;
            for (int classNum = 1; classNum <= 10; classNum++) {
                SchoolClass sc = classRepository.findByClassName("Class " + classNum).orElse(null);
                if (sc == null) continue;
                
                List<Section> sections = sectionRepository.findBySchoolClassId(sc.getId());
                int studentsPerSection = classNum <= 3 ? 3 : classNum <= 7 ? 4 : 5;
                
                for (Section section : sections) {
                    for (int i = 0; i < studentsPerSection; i++) {
                        String firstName = firstNames[(admNo + i) % firstNames.length];
                        String lastName = lastNames[(admNo * 7 + i) % lastNames.length];
                        String city = cities[(admNo + classNum) % cities.length];
                        
                        int ageOffset = (10 - classNum) * 365;
                        LocalDate dob = LocalDate.now().minusDays(ageOffset + (i * 7));
                        
                        studentsToAdd.add(Student.builder()
                            .admissionNumber("ADM" + (admNo++))
                            .name(firstName + " " + lastName)
                            .gender(i % 2 == 0 ? "Male" : "Female")
                            .dateOfBirth(dob)
                            .fatherName(firstName + " Sr. " + lastName)
                            .motherName(firstName + "i " + lastName)
                            .parentContact("98765" + String.format("%05d", admNo % 100000))
                            .parentEmail(firstName.toLowerCase() + "@parent.edu")
                            .parentOccupation(new String[]{"Business","Service","Professional","Agriculture","Self-Employed"}[admNo % 5])
                            .address((admNo % 100) + " " + new String[]{"Main","Park","Lake","Garden","Hill"}[admNo % 5] + " Street")
                            .city(city)
                            .state("Maharashtra")
                            .pincode(String.format("%06d", 400000 + admNo))
                            .schoolClass(sc)
                            .section(section)
                            .admissionDate(LocalDate.of(2024, 6, 1))
                            .bloodGroup(bloodGroups[admNo % bloodGroups.length])
                            .active(true)
                            .build());
                    }
                }
            }
            
            if (!studentsToAdd.isEmpty()) {
                studentRepository.saveAll(studentsToAdd);
            }
        }

        // Always ensure student login accounts exist (idempotent — safe to re-run)
        String encoded = passwordEncoder.encode("password");
        List<Student> firstTwo = studentRepository.findAll().stream().limit(2).toList();
        for (int i = 0; i < firstTwo.size(); i++) {
            Student student = firstTwo.get(i);
            String username = "student" + (i + 1);
            userRepository.findByUsername(username).ifPresentOrElse(
                existing -> {
                    existing.setPassword(encoded);
                    existing.setStudentId(student.getId());
                    userRepository.save(existing);
                },
                () -> userRepository.save(User.builder()
                    .username(username)
                    .password(encoded)
                    .fullName(student.getName())
                    .email(username + "@school.edu")
                    .role(User.Role.STUDENT)
                    .studentId(student.getId())
                    .active(true)
                    .build())
            );
        }
    }
}