package com.school.admin.controller;

import com.school.admin.dto.ScheduleRequest;
import com.school.admin.repository.UserRepository;
import com.school.admin.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> create(@RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.update(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(scheduleService.getAll());
    }

    @GetMapping("/class/{classId}/section/{sectionId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> getByClassAndSection(@PathVariable Long classId, @PathVariable Long sectionId) {
        return ResponseEntity.ok(scheduleService.getByClassAndSection(classId, sectionId));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','TEACHER','ADMIN')")
    public ResponseEntity<?> getByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(scheduleService.getByTeacher(teacherId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getTeachers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("TEACHER"))
                .toList());
    }
}
