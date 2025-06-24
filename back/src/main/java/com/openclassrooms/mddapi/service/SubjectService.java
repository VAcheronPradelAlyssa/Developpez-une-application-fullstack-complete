package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.mapper.SubjectMapper;
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
        Subject subject = SubjectMapper.toEntity(dto);
        subject = subjectRepository.save(subject);
        return SubjectMapper.toDto(subject);
    }

    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
            .map(SubjectMapper::toDto)
            .collect(Collectors.toList());
    }

    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        return SubjectMapper.toDto(subject);
    }
}