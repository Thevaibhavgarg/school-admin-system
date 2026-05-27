package com.school.admin.service;

import com.school.admin.dto.AttendanceRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.Attendance;
import com.school.admin.model.SchoolClass;
import com.school.admin.model.Section;
import com.school.admin.model.Student;
import com.school.admin.model.User;
import com.school.admin.repository.AttendanceRepository;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SectionRepository;
import com.school.admin.repository.StudentRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<Attendance> markBulk(AttendanceRequest request, String teacherUsername) {
        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        List<Attendance> saved = new ArrayList<>();
        for (AttendanceRequest.AttendanceEntry entry : request.getEntries()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + entry.getStudentId()));

            Attendance attendance = attendanceRepository
                    .existsByStudentIdAndDate(student.getId(), request.getDate())
                    ? attendanceRepository.findBySchoolClassIdAndSectionIdAndDate(
                            request.getClassId(), request.getSectionId(), request.getDate())
                        .stream().filter(a -> a.getStudent().getId().equals(student.getId()))
                        .findFirst().orElse(new Attendance())
                    : new Attendance();

            attendance.setStudent(student);
            attendance.setDate(request.getDate());
            attendance.setStatus(Attendance.Status.valueOf(entry.getStatus()));
            attendance.setMarkedBy(teacher);
            attendance.setSchoolClass(schoolClass);
            attendance.setSection(section);
            saved.add(attendanceRepository.save(attendance));
        }
        return saved;
    }

    public List<Attendance> getByClassSectionDate(Long classId, Long sectionId, LocalDate date) {
        return attendanceRepository.findBySchoolClassIdAndSectionIdAndDate(classId, sectionId, date);
    }

    public List<Attendance> getByStudent(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByDateDesc(studentId);
    }

    public Map<String, Object> getStudentSummary(Long studentId) {
        long total = attendanceRepository.countTotalByStudentId(studentId);
        long present = attendanceRepository.countPresentByStudentId(studentId);
        double percentage = total > 0 ? (present * 100.0 / total) : 0;
        return Map.of(
                "studentId", studentId,
                "totalDays", total,
                "presentDays", present,
                "absentDays", total - present,
                "percentage", Math.round(percentage * 100.0) / 100.0
        );
    }

    public void delete(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found");
        }
        attendanceRepository.deleteById(id);
    }
}
