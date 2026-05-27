package com.school.admin.dto;

import lombok.Data;

@Data
public class PerformanceRequest {
    private Long studentId;
    private Long subjectId;
    private String examType;
    private Double marks;
    private Double maxMarks;
    private String term;
    private String academicYear;
    private String remarks;
}
