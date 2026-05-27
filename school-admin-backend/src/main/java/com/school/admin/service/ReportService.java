package com.school.admin.service;

import com.school.admin.model.*;
import com.school.admin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepository;
    private final SyllabusRepository syllabusRepository;
    private final AttendanceRepository attendanceRepository;
    private final PerformanceRepository performanceRepository;
    private final SchoolClassRepository classRepository;

    public Map<String, Object> getAdmissionReport() {
        List<Student> students = studentRepository.findAll();
        Map<String, Long> byClass = students.stream()
                .filter(Student::isActive)
                .collect(Collectors.groupingBy(
                        s -> s.getSchoolClass() != null ? s.getSchoolClass().getClassName() : "Unassigned",
                        Collectors.counting()
                ));
        return Map.of(
                "totalStudents", students.stream().filter(Student::isActive).count(),
                "byClass", byClass,
                "recentAdmissions", students.stream()
                        .filter(Student::isActive)
                        .sorted((a, b) -> b.getAdmissionDate() != null && a.getAdmissionDate() != null
                                ? b.getAdmissionDate().compareTo(a.getAdmissionDate()) : 0)
                        .limit(10)
                        .toList()
        );
    }

    public Map<String, Object> getSyllabusReport(Long classId, String academicYear) {
        List<Syllabus> syllabi = syllabusRepository.findBySchoolClassIdAndAcademicYear(classId, academicYear);
        long completed = syllabi.stream().filter(Syllabus::isCompleted).count();
        return Map.of(
                "totalTopics", syllabi.size(),
                "completedTopics", completed,
                "pendingTopics", syllabi.size() - completed,
                "completionPercent", syllabi.isEmpty() ? 0 : Math.round(completed * 100.0 / syllabi.size()),
                "syllabi", syllabi
        );
    }

    public Map<String, Object> getClassStudentReport() {
        List<SchoolClass> classes = classRepository.findAll();
        List<Map<String, Object>> classData = classes.stream().map(c -> {
            Map<String, Object> row = new HashMap<>();
            row.put("classId", c.getId());
            row.put("className", c.getClassName());
            row.put("studentCount", studentRepository.countBySchoolClassId(c.getId()));
            return row;
        }).toList();
        return Map.of(
                "classes", classData,
                "totalActiveStudents", studentRepository.countByActive(true)
        );
    }

    public Map<String, Object> getAttendanceReport(Long classId, String from, String to) {
        List<Student> students = studentRepository.findBySchoolClassIdAndActive(classId, true);
        List<Map<String, Object>> attendanceData = students.stream().map(s -> {
            long total = attendanceRepository.countTotalByStudentId(s.getId());
            long present = attendanceRepository.countPresentByStudentId(s.getId());
            Map<String, Object> row = new HashMap<>();
            row.put("studentId", s.getId());
            row.put("studentName", s.getName());
            row.put("admissionNumber", s.getAdmissionNumber());
            row.put("totalDays", total);
            row.put("presentDays", present);
            row.put("percentage", total > 0 ? Math.round(present * 100.0 / total * 100) / 100.0 : 0);
            return row;
        }).toList();
        return Map.of("classId", classId, "attendanceData", attendanceData);
    }

    public Map<String, Object> getPerformanceReport(Long classId, String academicYear) {
        List<Performance> records = performanceRepository.findByClassIdAndAcademicYear(classId, academicYear);
        Map<String, Double> avgBySubject = records.stream()
                .collect(Collectors.groupingBy(
                        p -> p.getSubject().getName(),
                        Collectors.averagingDouble(p -> p.getMarks() / p.getMaxMarks() * 100)
                ));
        return Map.of(
                "classId", classId,
                "academicYear", academicYear,
                "averageBySubject", avgBySubject,
                "totalRecords", records.size()
        );
    }
}
