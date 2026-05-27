package com.school.admin.dto;

import lombok.Data;

@Data
public class ScheduleRequest {
    private Long classId;
    private Long sectionId;
    private Long subjectId;
    private Long teacherId;
    private String day;
    private Integer period;
    private String startTime;
    private String endTime;
    private String academicYear;
}
