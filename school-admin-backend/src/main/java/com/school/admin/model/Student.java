package com.school.admin.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admission_number", unique = true, nullable = false)
    private String admissionNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Parent Details
    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "mother_name")
    private String motherName;

    @Column(name = "parent_contact")
    private String parentContact;

    @Column(name = "parent_email")
    private String parentEmail;

    @Column(name = "parent_occupation")
    private String parentOccupation;

    // Class assignment
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "section_id")
    private Section section;

    // Previous class performance
    @Column(name = "previous_class")
    private String previousClass;

    @Column(name = "previous_percentage")
    private Double previousPercentage;

    @Column(name = "previous_grade")
    private String previousGrade;

    @Column(name = "previous_school")
    private String previousSchool;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Builder.Default
    private boolean active = true;
}
