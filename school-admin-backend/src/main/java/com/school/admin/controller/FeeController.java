package com.school.admin.controller;

import com.school.admin.dto.FeePaymentRequest;
import com.school.admin.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLERK','ADMIN')")
    public ResponseEntity<?> process(@RequestBody FeePaymentRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(feeService.process(request, userDetails.getUsername()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLERK','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(feeService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLERK','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feeService.getById(id));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('CLERK','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getByStudent(studentId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('CLERK','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getPending() {
        return ResponseEntity.ok(feeService.getPending());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getSummary(@RequestParam(defaultValue = "2024-2025") String academicYear) {
        return ResponseEntity.ok(feeService.getFinancialSummary(academicYear));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('CLERK','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> approve(@PathVariable Long id,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(feeService.approveFee(id, userDetails.getUsername()));
    }
}
