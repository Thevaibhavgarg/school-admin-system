package com.school.admin.repository;

import com.school.admin.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    List<Performance> findByStudentId(Long studentId);

    List<Performance> findByStudentIdAndAcademicYear(Long studentId, String academicYear);

    List<Performance> findByStudentIdAndSubjectIdAndAcademicYear(Long studentId, Long subjectId, String academicYear);

    @Query("SELECT p FROM Performance p WHERE p.subject.schoolClass.id = :classId AND p.academicYear = :year")
    List<Performance> findByClassIdAndAcademicYear(@Param("classId") Long classId, @Param("year") String year);

    @Query("SELECT AVG(p.marks / p.maxMarks * 100) FROM Performance p WHERE p.student.id = :studentId AND p.academicYear = :year")
    Double avgPercentageByStudentAndYear(@Param("studentId") Long studentId, @Param("year") String year);
}
