package com.school.admin.repository;

import com.school.admin.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findBySchoolClassIdAndSectionIdAndDate(Long classId, Long sectionId, LocalDate date);

    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);

    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a FROM Attendance a WHERE a.schoolClass.id = :classId AND a.date BETWEEN :from AND :to")
    List<Attendance> findByClassAndDateRange(@Param("classId") Long classId,
                                             @Param("from") LocalDate from,
                                             @Param("to") LocalDate to);
}
