package com.school.admin.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequest {
    private Long classId;
    private Long sectionId;
    private LocalDate date;
    private List<AttendanceEntry> entries;

    @Data
    public static class AttendanceEntry {
        private Long studentId;
        private String status;
    }
}
