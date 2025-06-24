package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    private CommentRepository commentRepository;
    private PostRepository postRepository;
    private UserRepository userRepository;
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        commentRepository = mock(CommentRepository.class);
        postRepository = mock(PostRepository.class);
        userRepository = mock(UserRepository.class);
        commentService = new CommentService(commentRepository, postRepository, userRepository);
    }

    @Test
    void getCommentsByPostId_empty() {
        when(commentRepository.findByPostId(1L)).thenReturn(Collections.emptyList());
        assertTrue(commentService.getCommentsByPostId(1L).isEmpty());
    }

    @Test
    void createComment_success() {
        CommentCreateDTO dto = new CommentCreateDTO();
        dto.setContent("test");
        User user = new User();
        Post post = new Post();
        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("test"); // Correction ici
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        Comment result = commentService.createComment(dto, user, post);
        assertEquals(1L, result.getId());
        assertEquals("test", result.getContent());
    }
}
