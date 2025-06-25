package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.dto.PostDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    private PostRepository postRepository;
    private PostService postService;

    @BeforeEach
    void setUp() {
        postRepository = mock(PostRepository.class);
        postService = new PostService(postRepository);
    }

    @Test
    void getAllPosts_empty() {
        when(postRepository.findAll()).thenReturn(Collections.emptyList());
        assertTrue(postService.getAllPosts().isEmpty());
    }

    @Test
    void createPost_success() {
        PostCreateDTO dto = new PostCreateDTO();
        dto.setTitle("Titre");
        dto.setContent("Contenu");
        User user = new User();
        user.setId(1L);
        user.setUsername("mockuser");
        Subject subject = new Subject();
        subject.setId(2L);
        subject.setName("SujetTest");

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setAuthor(user);
        post.setSubject(subject);

        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostDTO result = postService.createPost(dto, user, subject);
        assertEquals(1L, result.getId());
        assertEquals("Titre", result.getTitle());
        assertEquals("Contenu", result.getContent());
        assertEquals(1L, result.getAuthorId());
        assertEquals("mockuser", result.getAuthorUsername());
        assertEquals(2L, result.getSubjectId());
        assertEquals("SujetTest", result.getSubjectName());
    }

    @Test
    void getPostById_found() {
        Post post = new Post();
        post.setId(2L);
        post.setTitle("Titre");
        post.setContent("Contenu");
        User user = new User();
        user.setId(1L);
        user.setUsername("mockuser");
        post.setAuthor(user);
        Subject subject = new Subject();
        subject.setId(2L);
        subject.setName("SujetTest");
        post.setSubject(subject);

        when(postRepository.findById(2L)).thenReturn(Optional.of(post));
        Optional<PostDTO> result = postService.getPostById(2L);
        assertTrue(result.isPresent());
        assertEquals(2L, result.get().getId());
        assertEquals("mockuser", result.get().getAuthorUsername());
    }
}
