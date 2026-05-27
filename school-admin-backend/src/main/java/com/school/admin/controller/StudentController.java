package com.school.admin.controller;

import com.school.admin.dto.StudentRequest;
import com.school.admin.exception.BadRequestException;
import com.school.admin.model.*;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SectionRepository;
import com.school.admin.repository.SubjectRepository;
import com.school.admin.repository.UserRepository;
import com.school.admin.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLERK','ADMIN')")
    public ResponseEntity<?> admit(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.admit(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLERK','ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.update(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CLERK','TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(studentService.getAll());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.getStudentId() == null) {
            throw new BadRequestException("No student profile linked to this account");
        }
        return ResponseEntity.ok(studentService.getById(user.getStudentId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLERK','TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getById(id));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('CLERK','TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(studentService.getByClass(classId));
    }

    @GetMapping("/class/{classId}/section/{sectionId}")
    @PreAuthorize("hasAnyRole('CLERK','TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> getByClassAndSection(@PathVariable Long classId, @PathVariable Long sectionId) {
        return ResponseEntity.ok(studentService.getByClassAndSection(classId, sectionId));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('CLERK','TEACHER','PRINCIPAL','ADMIN')")
    public ResponseEntity<?> search(@RequestParam String query) {
        return ResponseEntity.ok(studentService.search(query));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLERK','ADMIN')")
    public ResponseEntity<?> deactivate(@PathVariable Long id) {
        studentService.deactivate(id);
        return ResponseEntity.ok("Student deactivated");
    }

    // Reference data endpoints
    @GetMapping("/classes")
    public ResponseEntity<?> getClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    @GetMapping("/sections/class/{classId}")
    public ResponseEntity<?> getSections(@PathVariable Long classId) {
        return ResponseEntity.ok(sectionRepository.findBySchoolClassId(classId));
    }

    @GetMapping("/subjects/class/{classId}")
    public ResponseEntity<?> getSubjects(@PathVariable Long classId) {
        return ResponseEntity.ok(subjectRepository.findBySchoolClassId(classId));
    }

    // ========== CLASS MANAGEMENT ==========
    @PostMapping("/classes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addClass(@RequestBody Map<String, String> request) {
        String className = request.get("className");
        if (className == null || className.trim().isEmpty()) {
            throw new BadRequestException("Class name is required");
        }
        SchoolClass schoolClass = SchoolClass.builder()
                .className(className.trim())
                .build();
        return ResponseEntity.ok(classRepository.save(schoolClass));
    }

    @PutMapping("/classes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateClass(@PathVariable Long id, @RequestBody Map<String, String> request) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Class not found"));
        String className = request.get("className");
        if (className != null && !className.trim().isEmpty()) {
            schoolClass.setClassName(className.trim());
        }
        return ResponseEntity.ok(classRepository.save(schoolClass));
    }

    @DeleteMapping("/classes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        SchoolClass schoolClass = classRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Class not found"));
        classRepository.delete(schoolClass);
        return ResponseEntity.ok("Class deleted successfully");
    }

    // ========== SECTION MANAGEMENT ==========
    @PostMapping("/sections")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSection(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        Long classId = ((Number) request.get("classId")).longValue();
        
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Section name is required");
        }
        
        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() -> new BadRequestException("Class not found"));
        
        Section section = Section.builder()
                .name(name.trim())
                .schoolClass(schoolClass)
                .build();
        return ResponseEntity.ok(sectionRepository.save(section));
    }

    @PutMapping("/sections/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSection(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Section not found"));
        
        String name = (String) request.get("name");
        if (name != null && !name.trim().isEmpty()) {
            section.setName(name.trim());
        }
        
        return ResponseEntity.ok(sectionRepository.save(section));
    }

    @DeleteMapping("/sections/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Section not found"));
        sectionRepository.delete(section);
        return ResponseEntity.ok("Section deleted successfully");
    }

    // ========== SUBJECT MANAGEMENT ==========
    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addSubject(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String code = (String) request.get("code");
        Long classId = request.get("classId") != null ? ((Number) request.get("classId")).longValue() : null;
        
        if (name == null || name.trim().isEmpty()) {
            throw new BadRequestException("Subject name is required");
        }
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Subject code is required");
        }
        
        SchoolClass schoolClass = null;
        if (classId != null) {
            schoolClass = classRepository.findById(classId)
                    .orElseThrow(() -> new BadRequestException("Class not found"));
        }
        
        Subject subject = Subject.builder()
                .name(name.trim())
                .code(code.trim().toUpperCase())
                .schoolClass(schoolClass)
                .build();
        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @PutMapping("/subjects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Subject not found"));
        
        String name = (String) request.get("name");
        String code = (String) request.get("code");
        
        if (name != null && !name.trim().isEmpty()) {
            subject.setName(name.trim());
        }
        if (code != null && !code.trim().isEmpty()) {
            subject.setCode(code.trim().toUpperCase());
        }
        
        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @DeleteMapping("/subjects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Subject not found"));
        subjectRepository.delete(subject);
        return ResponseEntity.ok("Subject deleted successfully");
    }
}
