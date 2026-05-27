package com.school.admin.service;

import com.school.admin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final StudentRepository studentRepository;
    private final PerformanceRepository performanceRepository;
    private final FeePaymentRepository feeRepository;
    private final SchoolClassRepository classRepository;

    public Map<String, Object> getAcademicAnalysis(String academicYear) {
        List<com.school.admin.model.SchoolClass> classes = classRepository.findAll();

        List<Map<String, Object>> classPerf = classes.stream().map(c -> {
            List<com.school.admin.model.Performance> records =
                    performanceRepository.findByClassIdAndAcademicYear(c.getId(), academicYear);
            double avg = records.isEmpty() ? 0 :
                    records.stream().mapToDouble(p -> p.getMarks() / p.getMaxMarks() * 100).average().orElse(0);
            long passCount = records.stream()
                    .filter(p -> (p.getMarks() / p.getMaxMarks() * 100) >= 35)
                    .count();
            Map<String, Object> row = new HashMap<>();
            row.put("className", c.getClassName());
            row.put("classId", c.getId());
            row.put("averagePercentage", Math.round(avg * 100) / 100.0);
            row.put("totalRecords", records.size());
            row.put("passCount", passCount);
            return row;
        }).toList();

        long totalStudents = studentRepository.countByActive(true);

        return Map.of(
                "academicYear", academicYear,
                "totalStudents", totalStudents,
                "classwisePerformance", classPerf
        );
    }

    public Map<String, Object> getFinancialAnalysis(String academicYear) {
        Double collected = feeRepository.totalCollectedByYear(academicYear);
        Double pending = feeRepository.totalPendingByYear(academicYear);
        long paidCount = feeRepository.countPaidByYear(academicYear);
        long totalStudents = studentRepository.countByActive(true);

        double collectionRate = (totalStudents > 0 && paidCount > 0)
                ? Math.round(paidCount * 100.0 / totalStudents * 100) / 100.0 : 0;

        return Map.of(
                "academicYear", academicYear,
                "totalCollected", collected != null ? collected : 0.0,
                "totalPending", pending != null ? pending : 0.0,
                "paidCount", paidCount,
                "totalStudents", totalStudents,
                "collectionRatePercent", collectionRate
        );
    }

    public Map<String, Object> getDashboardSummary(String academicYear) {
        Map<String, Object> academic = getAcademicAnalysis(academicYear);
        Map<String, Object> financial = getFinancialAnalysis(academicYear);
        return Map.of(
                "academic", academic,
                "financial", financial
        );
    }
}
