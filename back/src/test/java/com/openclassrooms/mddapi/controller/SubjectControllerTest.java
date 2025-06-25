package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.service.SubjectService;
import com.openclassrooms.mddapi.service.TokenBlacklistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubjectController.class)
@Import(SubjectControllerTest.NoSecurityConfig.class)
class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubjectService subjectService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private ObjectMapper objectMapper;

    private SubjectDTO subjectDTO;

    @BeforeEach
    void setup() {
        subjectDTO = new SubjectDTO();
        subjectDTO.setId(1L);
        subjectDTO.setName("SujetTest");
        subjectDTO.setDescription("desc");
    }

    @Test
    void getAllSubjects_shouldReturnList() throws Exception {
        when(subjectService.getAllSubjects()).thenReturn(Collections.singletonList(subjectDTO));

        mockMvc.perform(get("/api/subjects")
                .with(SecurityMockMvcRequestPostProcessors.user("mockuser")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("SujetTest"));
    }

    @Test
    void createSubject_shouldReturnCreatedSubject() throws Exception {
        when(subjectService.createSubject(any())).thenReturn(subjectDTO);

        mockMvc.perform(post("/api/subjects")
                .with(SecurityMockMvcRequestPostProcessors.user("mockuser"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subjectDTO)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("SujetTest"));
    }

    @TestConfiguration
    static class NoSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}
        
