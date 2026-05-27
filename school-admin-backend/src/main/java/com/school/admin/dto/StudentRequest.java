package com.school.admin.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentRequest {
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String fatherName;
    private String motherName;
    private String parentContact;
    private String parentEmail;
    private String parentOccupation;
    private Long classId;
    private Long sectionId;
    private String previousClass;
    private Double previousPercentage;
    private String previousGrade;
    private String previousSchool;
    private LocalDate admissionDate;
    private String bloodGroup;
    private Boolean active;
}
