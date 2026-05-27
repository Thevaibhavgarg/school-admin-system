package com.school.admin.service;

import com.school.admin.dto.SyllabusRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.SchoolClass;
import com.school.admin.model.Subject;
import com.school.admin.model.Syllabus;
import com.school.admin.model.User;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SubjectRepository;
import com.school.admin.repository.SyllabusRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;
    private final SchoolClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public Syllabus add(SyllabusRequest request, String teacherUsername) {
        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Syllabus syllabus = Syllabus.builder()
                .schoolClass(schoolClass)
                .subject(subject)
                .term(request.getTerm())
                .topic(request.getTopic())
                .description(request.getDescription())
                .completedDate(request.getCompletedDate())
                .completed(request.isCompleted())
                .academicYear(request.getAcademicYear())
                .teacher(teacher)
                .build();
        return syllabusRepository.save(syllabus);
    }

    public Syllabus update(Long id, SyllabusRequest request) {
        Syllabus syllabus = syllabusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Syllabus entry not found"));
        syllabus.setTopic(request.getTopic());
        syllabus.setDescription(request.getDescription());
        syllabus.setTerm(request.getTerm());
        syllabus.setCompleted(request.isCompleted());
        syllabus.setCompletedDate(request.getCompletedDate());
        return syllabusRepository.save(syllabus);
    }

    public List<Syllabus> getByClassAndYear(Long classId, String academicYear) {
        return syllabusRepository.findBySchoolClassIdAndAcademicYear(classId, academicYear);
    }

    public List<Syllabus> getAll() {
        return syllabusRepository.findAll();
    }

    public void delete(Long id) {
        syllabusRepository.deleteById(id);
    }
}
