package com.school.admin.service;

import com.school.admin.dto.StudentRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.SchoolClass;
import com.school.admin.model.Section;
import com.school.admin.model.Student;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SectionRepository;
import com.school.admin.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;

    public Student admit(StudentRequest request) {
        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        String admissionNumber = generateAdmissionNumber();

        Student student = Student.builder()
                .admissionNumber(admissionNumber)
                .name(request.getName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .fatherName(request.getFatherName())
                .motherName(request.getMotherName())
                .parentContact(request.getParentContact())
                .parentEmail(request.getParentEmail())
                .parentOccupation(request.getParentOccupation())
                .schoolClass(schoolClass)
                .section(section)
                .previousClass(request.getPreviousClass())
                .previousPercentage(request.getPreviousPercentage())
                .previousGrade(request.getPreviousGrade())
                .previousSchool(request.getPreviousSchool())
                .admissionDate(request.getAdmissionDate() != null ? request.getAdmissionDate() : LocalDate.now())
                .bloodGroup(request.getBloodGroup())
                .active(true)
                .build();
        return studentRepository.save(student);
    }

    public Student update(Long id, StudentRequest request) {
        Student student = getById(id);
        
        // Only update class/section if provided
        if (request.getClassId() != null) {
            SchoolClass schoolClass = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
            student.setSchoolClass(schoolClass);
        }
        if (request.getSectionId() != null) {
            Section section = sectionRepository.findById(request.getSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
            student.setSection(section);
        }

        if (request.getName() != null) student.setName(request.getName());
        if (request.getDateOfBirth() != null) student.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) student.setGender(request.getGender());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getCity() != null) student.setCity(request.getCity());
        if (request.getState() != null) student.setState(request.getState());
        if (request.getPincode() != null) student.setPincode(request.getPincode());
        if (request.getFatherName() != null) student.setFatherName(request.getFatherName());
        if (request.getMotherName() != null) student.setMotherName(request.getMotherName());
        if (request.getParentContact() != null) student.setParentContact(request.getParentContact());
        if (request.getParentEmail() != null) student.setParentEmail(request.getParentEmail());
        if (request.getParentOccupation() != null) student.setParentOccupation(request.getParentOccupation());
        if (request.getPreviousClass() != null) student.setPreviousClass(request.getPreviousClass());
        if (request.getPreviousPercentage() != null) student.setPreviousPercentage(request.getPreviousPercentage());
        if (request.getPreviousGrade() != null) student.setPreviousGrade(request.getPreviousGrade());
        if (request.getPreviousSchool() != null) student.setPreviousSchool(request.getPreviousSchool());
        if (request.getBloodGroup() != null) student.setBloodGroup(request.getBloodGroup());
        if (request.getActive() != null) student.setActive(request.getActive());
        
        return studentRepository.save(student);
    }

    public Student getById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public List<Student> getByClass(Long classId) {
        return studentRepository.findBySchoolClassIdAndActive(classId, true);
    }

    public List<Student> getByClassAndSection(Long classId, Long sectionId) {
        return studentRepository.findBySchoolClassIdAndSectionIdAndActive(classId, sectionId, true);
    }

    public List<Student> search(String query) {
        return studentRepository.searchByNameOrAdmission(query);
    }

    public void deactivate(Long id) {
        studentRepository.deleteById(id);
    }

    private String generateAdmissionNumber() {
        String year = DateTimeFormatter.ofPattern("yy").format(LocalDate.now());
        long count = studentRepository.count() + 1;
        return String.format("ADM%s%04d", year, count);
    }
}
