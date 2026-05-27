package com.school.admin.controller;

import com.school.admin.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @GetMapping("/academic")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> academic(@RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(analysisService.getAcademicAnalysis(academicYear));
    }

    @GetMapping("/financial")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> financial(@RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(analysisService.getFinancialAnalysis(academicYear));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> dashboard(@RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(analysisService.getDashboardSummary(academicYear));
    }
}
