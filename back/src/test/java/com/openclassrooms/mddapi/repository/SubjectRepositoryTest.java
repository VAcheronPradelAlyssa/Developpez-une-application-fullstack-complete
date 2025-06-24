package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Subject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class SubjectRepositoryTest {

    private SubjectRepository subjectRepository;

    @BeforeEach
    void setup() {
        subjectRepository = mock(SubjectRepository.class);
    }

    @Test
    void findById_shouldReturnSubject() {
        Subject subject = new Subject();
        subject.setId(1L);
        subject.setName("SujetTest");
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));

        Optional<Subject> result = subjectRepository.findById(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("SujetTest");
    }

    @Test
    void findAll_shouldReturnList() {
        Subject s1 = new Subject();
        s1.setId(1L);
        Subject s2 = new Subject();
        s2.setId(2L);
        when(subjectRepository.findAll()).thenReturn(List.of(s1, s2));

        List<Subject> subjects = subjectRepository.findAll();
        assertThat(subjects).hasSize(2);
    }

    @Test
    void existsByName_shouldReturnTrueIfExists() {
        when(subjectRepository.existsByName("SujetTest")).thenReturn(true);
        assertThat(subjectRepository.existsByName("SujetTest")).isTrue();
    }
}
