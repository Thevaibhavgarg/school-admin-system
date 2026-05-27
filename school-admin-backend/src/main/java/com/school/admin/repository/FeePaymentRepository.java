package com.school.admin.repository;

import com.school.admin.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {

    List<FeePayment> findByStudentId(Long studentId);

    List<FeePayment> findByStatus(FeePayment.Status status);

    List<FeePayment> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    @Query("SELECT SUM(f.amount) FROM FeePayment f WHERE f.status = 'PAID' AND f.academicYear = :year")
    Double totalCollectedByYear(@Param("year") String year);

    @Query("SELECT SUM(f.amount) FROM FeePayment f WHERE f.status = 'PENDING' AND f.academicYear = :year")
    Double totalPendingByYear(@Param("year") String year);

    @Query("SELECT COUNT(f) FROM FeePayment f WHERE f.status = 'PAID' AND f.academicYear = :year")
    long countPaidByYear(@Param("year") String year);
}
