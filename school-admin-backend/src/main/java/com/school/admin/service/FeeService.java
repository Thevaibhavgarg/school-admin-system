package com.school.admin.service;

import com.school.admin.dto.FeePaymentRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.FeePayment;
import com.school.admin.model.Student;
import com.school.admin.model.User;
import com.school.admin.repository.FeePaymentRepository;
import com.school.admin.repository.StudentRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeePaymentRepository feeRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public FeePayment process(FeePaymentRequest request, String clerkUsername) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        User clerk = userRepository.findByUsername(clerkUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FeePayment fee = FeePayment.builder()
                .student(student)
                .amount(request.getAmount())
                .feeType(request.getFeeType())
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now())
                .paymentMode(request.getPaymentMode())
                .receiptNumber(generateReceiptNumber())
                .status(FeePayment.Status.valueOf(request.getStatus() != null ? request.getStatus() : "PAID"))
                .remarks(request.getRemarks())
                .academicYear(request.getAcademicYear())
                .processedBy(clerk)
                .build();
        return feeRepository.save(fee);
    }

    public List<FeePayment> getByStudent(Long studentId) {
        return feeRepository.findByStudentId(studentId);
    }

    public List<FeePayment> getPending() {
        return feeRepository.findByStatus(FeePayment.Status.PENDING);
    }

    public List<FeePayment> getAll() {
        return feeRepository.findAll();
    }

    public FeePayment getById(Long id) {
        return feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee payment not found"));
    }

    public Map<String, Object> getFinancialSummary(String academicYear) {
        Double collected = feeRepository.totalCollectedByYear(academicYear);
        Double pending = feeRepository.totalPendingByYear(academicYear);
        long paidCount = feeRepository.countPaidByYear(academicYear);
        return Map.of(
                "totalCollected", collected != null ? collected : 0.0,
                "totalPending", pending != null ? pending : 0.0,
                "paidCount", paidCount,
                "academicYear", academicYear
        );
    }

    public FeePayment approveFee(Long id, String approverUsername) {
        FeePayment fee = feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee payment not found"));
        
        User approver = userRepository.findByUsername(approverUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        fee.setStatus(FeePayment.Status.PAID);
        fee.setProcessedBy(approver);
        fee.setPaymentDate(LocalDate.now());
        
        return feeRepository.save(fee);
    }

    private String generateReceiptNumber() {
        String prefix = "RCP" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now());
        long count = feeRepository.count() + 1;
        return String.format("%s%04d", prefix, count);
    }
}
