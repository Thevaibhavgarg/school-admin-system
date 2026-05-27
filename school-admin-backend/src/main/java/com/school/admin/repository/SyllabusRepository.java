package com.school.admin.repository;

import com.school.admin.model.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SyllabusRepository extends JpaRepository<Syllabus, Long> {
    List<Syllabus> findBySchoolClassIdAndAcademicYear(Long classId, String academicYear);
    List<Syllabus> findBySchoolClassIdAndSubjectIdAndTerm(Long classId, Long subjectId, String term);
    List<Syllabus> findByTeacherId(Long teacherId);
}
