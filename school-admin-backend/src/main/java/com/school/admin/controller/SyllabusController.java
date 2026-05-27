package com.school.admin.controller;

import com.school.admin.dto.SyllabusRequest;
import com.school.admin.service.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/syllabus")
@RequiredArgsConstructor
public class SyllabusController {

    private final SyllabusService syllabusService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> add(@RequestBody SyllabusRequest request,
                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(syllabusService.add(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SyllabusRequest request) {
        return ResponseEntity.ok(syllabusService.update(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(syllabusService.getAll());
    }

    @GetMapping("/class/{classId}/year/{academicYear}")
    @PreAuthorize("hasAnyRole('TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByClassAndYear(@PathVariable Long classId,
                                                @PathVariable String academicYear) {
        return ResponseEntity.ok(syllabusService.getByClassAndYear(classId, academicYear));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        syllabusService.delete(id);
        return ResponseEntity.ok("Deleted");
    }
}
