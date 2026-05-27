package com.school.admin.controller;

import com.school.admin.dto.AttendanceRequest;
import com.school.admin.exception.BadRequestException;
import com.school.admin.model.User;
import com.school.admin.repository.UserRepository;
import com.school.admin.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> markBulk(@RequestBody AttendanceRequest request,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(attendanceService.markBulk(request, userDetails.getUsername()));
    }

    @GetMapping("/class/{classId}/section/{sectionId}/date/{date}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByClassSectionDate(@PathVariable Long classId,
                                                    @PathVariable Long sectionId,
                                                    @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getByClassSectionDate(classId, sectionId, date));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/summary")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getStudentSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentSummary(studentId));
    }

    @GetMapping("/student/me")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<?> getMyAttendance(@AuthenticationPrincipal UserDetails userDetails) {
        Long studentId = resolveStudentId(userDetails);
        return ResponseEntity.ok(attendanceService.getByStudent(studentId));
    }

    @GetMapping("/student/me/summary")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<?> getMyAttendanceSummary(@AuthenticationPrincipal UserDetails userDetails) {
        Long studentId = resolveStudentId(userDetails);
        return ResponseEntity.ok(attendanceService.getStudentSummary(studentId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        attendanceService.delete(id);
        return ResponseEntity.ok("Attendance record deleted");
    }

    private Long resolveStudentId(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.getStudentId() == null) {
            throw new BadRequestException("No student profile linked to this account");
        }
        return user.getStudentId();
    }
}
