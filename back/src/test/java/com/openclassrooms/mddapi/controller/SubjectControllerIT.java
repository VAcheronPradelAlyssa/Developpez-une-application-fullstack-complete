package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SubjectControllerIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserRepository userRepository;

    private User user;
    private String token;

    @BeforeEach
    void setup() {
        subjectRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setUsername("subjectuser");
        user.setEmail("subjectuser@test.com");
        user.setPassword("$2a$10$abcdefghijklmnopqrstuv");
        user.setRole("USER");
        user = userRepository.save(user);

        token = JwtUtil.generateToken(user.getUsername(), user.getId());
    }

    @AfterEach
    void cleanup() {
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getAllSubjects_shouldReturnList() throws Exception {
        Subject subject = new Subject();
        subject.setName("Sujet1");
        subject.setDescription("desc1");
        subjectRepository.save(subject);

        mockMvc.perform(get("/api/subjects")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Sujet1"));
    }

    @Test
    void createSubject_shouldPersistAndReturnSubject() throws Exception {
        Subject subject = new Subject();
        subject.setName("Sujet2");
        subject.setDescription("desc2");

        mockMvc.perform(post("/api/subjects")
                .cookie(new Cookie("token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subject)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Sujet2"));

        List<Subject> subjects = subjectRepository.findAll();
        assertThat(subjects).hasSize(1);
        assertThat(subjects.get(0).getName()).isEqualTo("Sujet2");
    }
}
