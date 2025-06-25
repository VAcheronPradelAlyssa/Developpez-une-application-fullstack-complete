package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CommentRepositoryTest {

    private CommentRepository commentRepository;
    private PostRepository postRepository;
    private UserRepository userRepository;

    private User user;
    private Post post;

    @BeforeEach
    void setup() {
        commentRepository = mock(CommentRepository.class);
        postRepository = mock(PostRepository.class);
        userRepository = mock(UserRepository.class);

        user = new User();
        user.setId(1L);
        user.setUsername("commentuser");
        user.setEmail("comment@test.com");
        user.setPassword("pwd");
        user.setRole("USER");

        post = new Post();
        post.setId(2L);
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void findByPostId_shouldReturnCommentsForPost() {
        Comment comment1 = new Comment();
        comment1.setId(10L);
        comment1.setPost(post);
        comment1.setAuthor(user);
        comment1.setContent("Premier commentaire");
        comment1.setCreatedAt(LocalDateTime.now());

        Comment comment2 = new Comment();
        comment2.setId(11L);
        comment2.setPost(post);
        comment2.setAuthor(user);
        comment2.setContent("Deuxième commentaire");
        comment2.setCreatedAt(LocalDateTime.now());

        when(commentRepository.findByPostId(post.getId())).thenReturn(List.of(comment1, comment2));

        List<Comment> comments = commentRepository.findByPostId(post.getId());
        assertThat(comments).hasSize(2);
        assertThat(comments).extracting("content").contains("Premier commentaire", "Deuxième commentaire");
    }

    @Test
    void findByPostId_shouldReturnEmptyListIfNoComment() {
        when(commentRepository.findByPostId(999L)).thenReturn(Collections.emptyList());
        List<Comment> comments = commentRepository.findByPostId(999L);
        assertThat(comments).isEmpty();
    }
}

