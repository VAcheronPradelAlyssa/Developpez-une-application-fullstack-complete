package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private SubjectRepository subjectRepository;
    private PostService postService;

    @BeforeEach
    void setUp() {
        postRepository = mock(PostRepository.class);
        userRepository = mock(UserRepository.class);
        subjectRepository = mock(SubjectRepository.class);
        postService = new PostService(postRepository, userRepository, subjectRepository);
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
        Subject subject = new Subject();
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Titre"); // Correction ici
        post.setContent("Contenu"); // Correction ici
        when(postRepository.save(any(Post.class))).thenReturn(post);
        Post result = postService.createPost(dto, user, subject);
        assertEquals(1L, result.getId());
        assertEquals("Titre", result.getTitle());
        assertEquals("Contenu", result.getContent());
    }

    @Test
    void getPostById_found() {
        Post post = new Post();
        post.setId(2L);
        when(postRepository.findById(2L)).thenReturn(Optional.of(post));
        Optional<Post> result = postService.getPostById(2L);
        assertTrue(result.isPresent());
        assertEquals(2L, result.get().getId());
    }
}
