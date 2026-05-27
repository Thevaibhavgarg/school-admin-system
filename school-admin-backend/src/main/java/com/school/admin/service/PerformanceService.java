package com.school.admin.service;

import com.school.admin.dto.PerformanceRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.Performance;
import com.school.admin.model.Student;
import com.school.admin.model.Subject;
import com.school.admin.model.User;
import com.school.admin.repository.PerformanceRepository;
import com.school.admin.repository.StudentRepository;
import com.school.admin.repository.SubjectRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public Performance record(PerformanceRequest request, String teacherUsername) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Performance perf = Performance.builder()
                .student(student)
                .subject(subject)
                .examType(Performance.ExamType.valueOf(request.getExamType()))
                .marks(request.getMarks())
                .maxMarks(request.getMaxMarks())
                .term(request.getTerm())
                .academicYear(request.getAcademicYear())
                .remarks(request.getRemarks())
                .recordedBy(teacher)
                .build();
        return performanceRepository.save(perf);
    }

    public Performance update(Long id, PerformanceRequest request) {
        Performance perf = performanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance record not found"));
        perf.setMarks(request.getMarks());
        perf.setMaxMarks(request.getMaxMarks());
        perf.setRemarks(request.getRemarks());
        perf.setExamType(Performance.ExamType.valueOf(request.getExamType()));
        return performanceRepository.save(perf);
    }

    public List<Performance> getByStudent(Long studentId) {
        return performanceRepository.findByStudentId(studentId);
    }

    public List<Performance> getByStudentAndYear(Long studentId, String academicYear) {
        return performanceRepository.findByStudentIdAndAcademicYear(studentId, academicYear);
    }

    public List<Performance> getByClass(Long classId, String academicYear) {
        return performanceRepository.findByClassIdAndAcademicYear(classId, academicYear);
    }

    public void delete(Long id) {
        performanceRepository.deleteById(id);
    }
}
