package com.school.admin.controller;

import com.school.admin.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/admissions")
    @PreAuthorize("hasAnyRole('PRINCIPAL','CLERK','ADMIN')")
    public ResponseEntity<?> admissions() {
        return ResponseEntity.ok(reportService.getAdmissionReport());
    }

    @GetMapping("/syllabus/class/{classId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> syllabus(@PathVariable Long classId,
                                       @RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(reportService.getSyllabusReport(classId, academicYear));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> classStudents() {
        return ResponseEntity.ok(reportService.getClassStudentReport());
    }

    @GetMapping("/attendance/class/{classId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> attendance(@PathVariable Long classId,
                                         @RequestParam(required = false) String from,
                                         @RequestParam(required = false) String to) {
        return ResponseEntity.ok(reportService.getAttendanceReport(classId, from, to));
    }

    @GetMapping("/performance/class/{classId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> performance(@PathVariable Long classId,
                                          @RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(reportService.getPerformanceReport(classId, academicYear));
    }
}
