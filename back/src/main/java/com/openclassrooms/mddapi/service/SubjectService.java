package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public SubjectDTO createSubject(SubjectDTO dto) {
        if (subjectRepository.existsByName(dto.name)) {
            throw new IllegalArgumentException("Subject name already exists.");
        }
        Subject subject = new Subject();
        subject.setName(dto.name);
        subject.setDescription(dto.description);
        subject = subjectRepository.save(subject);
        dto.id = subject.getId();
        return dto;
    }

    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
            .map(s -> {
                SubjectDTO dto = new SubjectDTO();
                dto.id = s.getId();
                dto.name = s.getName();
                dto.description = s.getDescription();
                return dto;
            }).collect(Collectors.toList());
    }

    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        SubjectDTO dto = new SubjectDTO();
        dto.id = subject.getId();
        dto.name = subject.getName();
        dto.description = subject.getDescription();
        return dto;
    }
}