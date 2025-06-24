package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubjectServiceTest {

    private SubjectRepository subjectRepository;
    private SubjectService subjectService;

    @BeforeEach
    void setUp() {
        subjectRepository = mock(SubjectRepository.class);
        subjectService = new SubjectService(subjectRepository);
    }

    @Test
    void createSubject_success() {
        SubjectDTO dto = new SubjectDTO();
        dto.name = "Sujet";
        dto.description = "desc";
        when(subjectRepository.existsByName("Sujet")).thenReturn(false);
        Subject subject = new Subject();
        subject.setId(1L);
        subject.setName("Sujet");
        subject.setDescription("desc");
        when(subjectRepository.save(any(Subject.class))).thenReturn(subject);
        SubjectDTO result = subjectService.createSubject(dto);
        assertEquals(1L, result.id);
        assertEquals("Sujet", result.name);
    }

    @Test
    void getAllSubjects_empty() {
        when(subjectRepository.findAll()).thenReturn(Collections.emptyList());
        assertTrue(subjectService.getAllSubjects().isEmpty());
    }

    @Test
    void getSubjectById_found() {
        Subject subject = new Subject();
        subject.setId(2L);
        subject.setName("Test");
        subject.setDescription("desc");
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject));
        SubjectDTO dto = subjectService.getSubjectById(2L);
        assertEquals(2L, dto.id);
        assertEquals("Test", dto.name);
    }
}
