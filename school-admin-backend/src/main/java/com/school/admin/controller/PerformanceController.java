package com.school.admin.controller;

import com.school.admin.dto.PerformanceRequest;
import com.school.admin.exception.BadRequestException;
import com.school.admin.model.User;
import com.school.admin.repository.UserRepository;
import com.school.admin.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> record(@RequestBody PerformanceRequest request,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(performanceService.record(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PerformanceRequest request) {
        return ResponseEntity.ok(performanceService.update(id, request));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(performanceService.getByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/year/{academicYear}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByStudentAndYear(@PathVariable Long studentId,
                                                  @PathVariable String academicYear) {
        return ResponseEntity.ok(performanceService.getByStudentAndYear(studentId, academicYear));
    }

    @GetMapping("/student/me/year/{academicYear}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<?> getMyPerformance(@PathVariable String academicYear,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.getStudentId() == null) {
            throw new BadRequestException("No student profile linked to this account");
        }
        return ResponseEntity.ok(performanceService.getByStudentAndYear(user.getStudentId(), academicYear));
    }

    @GetMapping("/class/{classId}/year/{academicYear}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByClass(@PathVariable Long classId, @PathVariable String academicYear) {
        return ResponseEntity.ok(performanceService.getByClass(classId, academicYear));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        performanceService.delete(id);
        return ResponseEntity.ok("Deleted");
    }
}
