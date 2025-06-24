package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.Post;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PostRepositoryTest {

    private PostRepository postRepository;

    @BeforeEach
    void setup() {
        postRepository = mock(PostRepository.class);
    }

    @Test
    void findById_shouldReturnPost() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Titre");
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Optional<Post> result = postRepository.findById(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Titre");
    }

    @Test
    void findAll_shouldReturnList() {
        Post post1 = new Post();
        post1.setId(1L);
        Post post2 = new Post();
        post2.setId(2L);
        when(postRepository.findAll()).thenReturn(List.of(post1, post2));

        List<Post> posts = postRepository.findAll();
        assertThat(posts).hasSize(2);
    }
}
