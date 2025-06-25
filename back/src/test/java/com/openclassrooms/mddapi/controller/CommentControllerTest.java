package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.TokenBlacklistService;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
@Import(CommentControllerTest.NoSecurityConfig.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private ObjectMapper objectMapper;

    private Comment comment;
    private User user;
    private Post post;
    private CommentDTO commentDto;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("mockuser");
        post = new Post();
        post.setId(2L);
        post.setTitle("Titre");
        comment = new Comment();
        comment.setId(3L);
        comment.setContent("Contenu test");
        comment.setAuthor(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        // Prépare le DTO pour les mocks
        commentDto = new CommentDTO();
        commentDto.setId(3L);
        commentDto.setContent("Contenu test");
        commentDto.setAuthorId(1L);
        commentDto.setAuthorUsername("mockuser");
        commentDto.setPostId(2L);
        commentDto.setCreatedAt(comment.getCreatedAt());
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
    void getCommentsByPost_shouldReturnList() throws Exception {
        when(commentService.getCommentsByPostId(2L)).thenReturn(Collections.singletonList(commentDto));

        mockMvc.perform(get("/api/posts/2/comments"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].content").value("Contenu test"));
    }

    @Test
    void addComment_shouldReturnCreatedComment() throws Exception {
        CommentCreateDTO dto = new CommentCreateDTO();
        dto.setContent("Nouveau commentaire");
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(postRepository.findById(2L)).thenReturn(java.util.Optional.of(post));
        when(commentService.createComment(any(), any(), any())).thenReturn(commentDto);

        mockMvc.perform(post("/api/posts/2/comments")
                .with(SecurityMockMvcRequestPostProcessors.authentication(customAuth()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value("Contenu test"));
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
