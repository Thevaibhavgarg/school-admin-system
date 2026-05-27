package com.school.admin.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Data
public class SyllabusRequest {
    private Long classId;
    private Long subjectId;
    private String term;
    private String topic;
    private String description;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate completedDate;
    private boolean completed;
    private String academicYear;
}
