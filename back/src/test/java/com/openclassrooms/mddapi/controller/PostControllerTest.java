package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.dto.PostDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.PostService;
import com.openclassrooms.mddapi.service.TokenBlacklistService;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@WebMvcTest(PostController.class)
@Import(PostControllerTest.NoSecurityConfig.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private SubjectRepository subjectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Post post;
    private User user;
    private Subject subject;
    private PostDTO postDto;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("mockuser");
        subject = new Subject();
        subject.setId(2L);
        subject.setName("SujetTest");

        postDto = new PostDTO();
        postDto.setId(3L);
        postDto.setTitle("Titre test");
        postDto.setContent("Contenu test");
        postDto.setAuthorId(1L);
        postDto.setAuthorUsername("mockuser");
        postDto.setSubjectId(2L);
        postDto.setSubjectName("SujetTest");
        postDto.setCreatedAt(java.time.LocalDateTime.now());
    }

    private UsernamePasswordAuthenticationToken customAuth() {
        CustomUserPrincipal principal = new CustomUserPrincipal(1L, "mockuser");
        return new UsernamePasswordAuthenticationToken(
            principal,
            null,
            java.util.List.of()
        );
    }

    @Test
    void getAllPosts_shouldReturnList() throws Exception {
        when(postService.getAllPosts()).thenReturn(Collections.singletonList(postDto));

        mockMvc.perform(get("/api/posts")
                .with(SecurityMockMvcRequestPostProcessors.user("mockuser")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Titre test"));
    }

    @Test
    void getPostById_shouldReturnPost() throws Exception {
        when(postService.getPostById(3L)).thenReturn(Optional.of(postDto));

        mockMvc.perform(get("/api/posts/3")
                .with(SecurityMockMvcRequestPostProcessors.user("mockuser")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Titre test"));
    }

    @Test
    void getPostById_shouldReturn404IfNotFound() throws Exception {
        when(postService.getPostById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/posts/999")
                .with(SecurityMockMvcRequestPostProcessors.user("mockuser")))
            .andExpect(status().isNotFound());
    }

    @Test
    void createPost_shouldReturnCreatedPost() throws Exception {
        PostCreateDTO dto = new PostCreateDTO();
        dto.setTitle("Titre créé");
        dto.setContent("Contenu créé");
        dto.setSubjectId(2L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject));
        when(postService.createPost(any(), any(), any())).thenReturn(postDto);

        mockMvc.perform(post("/api/posts")
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication(customAuth()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Titre test"));
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
