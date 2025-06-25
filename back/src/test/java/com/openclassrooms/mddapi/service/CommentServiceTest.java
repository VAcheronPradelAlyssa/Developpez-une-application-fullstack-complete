package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    private CommentRepository commentRepository;
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        commentRepository = mock(CommentRepository.class);
        commentService = new CommentService(commentRepository);
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
        user.setId(1L);
        user.setUsername("mockuser");
        Post post = new Post();
        post.setId(2L);

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("test");
        comment.setAuthor(user);
        comment.setPost(post);

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        CommentDTO result = commentService.createComment(dto, user, post);
        assertEquals(1L, result.getId());
        assertEquals("test", result.getContent());
        assertEquals(1L, result.getAuthorId());
        assertEquals("mockuser", result.getAuthorUsername());
        assertEquals(2L, result.getPostId());
    }
}
