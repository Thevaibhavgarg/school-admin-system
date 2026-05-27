package com.school.admin.service;

import com.school.admin.dto.ScheduleRequest;
import com.school.admin.exception.ResourceNotFoundException;
import com.school.admin.model.ClassSchedule;
import com.school.admin.model.SchoolClass;
import com.school.admin.model.Section;
import com.school.admin.model.Subject;
import com.school.admin.model.User;
import com.school.admin.repository.ClassScheduleRepository;
import com.school.admin.repository.SchoolClassRepository;
import com.school.admin.repository.SectionRepository;
import com.school.admin.repository.SubjectRepository;
import com.school.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ClassScheduleRepository scheduleRepository;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public ClassSchedule create(ScheduleRequest request) {
        SchoolClass schoolClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        ClassSchedule schedule = ClassSchedule.builder()
                .schoolClass(schoolClass)
                .section(section)
                .subject(subject)
                .teacher(teacher)
                .day(request.getDay())
                .period(request.getPeriod())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .academicYear(request.getAcademicYear())
                .build();
        return scheduleRepository.save(schedule);
    }

    public ClassSchedule update(Long id, ScheduleRequest request) {
        ClassSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        schedule.setTeacher(teacher);
        schedule.setSubject(subject);
        schedule.setDay(request.getDay());
        schedule.setPeriod(request.getPeriod());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        return scheduleRepository.save(schedule);
    }

    public List<ClassSchedule> getByClassAndSection(Long classId, Long sectionId) {
        return scheduleRepository.findBySchoolClassIdAndSectionId(classId, sectionId);
    }

    public List<ClassSchedule> getByTeacher(Long teacherId) {
        return scheduleRepository.findByTeacherId(teacherId);
    }

    public List<ClassSchedule> getAll() {
        return scheduleRepository.findAll();
    }

    public void delete(Long id) {
        scheduleRepository.deleteById(id);
    }
}
