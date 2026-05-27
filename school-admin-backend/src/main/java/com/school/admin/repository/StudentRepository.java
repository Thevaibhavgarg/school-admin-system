package com.school.admin.repository;

import com.school.admin.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    List<Student> findBySchoolClassIdAndActive(Long classId, boolean active);
    List<Student> findBySchoolClassIdAndSectionIdAndActive(Long classId, Long sectionId, boolean active);

    @Query("SELECT s FROM Student s WHERE s.active = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%',:query,'%')) OR s.admissionNumber LIKE CONCAT('%',:query,'%'))")
    List<Student> searchByNameOrAdmission(@Param("query") String query);

    long countBySchoolClassId(Long classId);
    long countByActive(boolean active);
}
