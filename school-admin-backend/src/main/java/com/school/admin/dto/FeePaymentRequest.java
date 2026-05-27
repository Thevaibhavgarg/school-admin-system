package com.school.admin.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FeePaymentRequest {
    private Long studentId;
    private Double amount;
    private String feeType;
    private LocalDate paymentDate;
    private String paymentMode;
    private String status;
    private String remarks;
    private String academicYear;
}
