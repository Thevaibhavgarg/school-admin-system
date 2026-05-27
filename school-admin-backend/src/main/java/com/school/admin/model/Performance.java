package com.school.admin.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "performance")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false)
    private ExamType examType;

    @Column(nullable = false)
    private Double marks;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks;

    @Column(nullable = false)
    private String term;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by")
    private User recordedBy;

    public enum ExamType {
        CLASS_TEST, MIDTERM, FINAL, UNIT_TEST, ASSIGNMENT
    }
}
