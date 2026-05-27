package com.school.admin.repository;

import com.school.admin.model.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
    List<ClassSchedule> findBySchoolClassIdAndSectionId(Long classId, Long sectionId);
    List<ClassSchedule> findByTeacherId(Long teacherId);
    List<ClassSchedule> findBySchoolClassIdAndSectionIdAndAcademicYear(Long classId, Long sectionId, String academicYear);
}
