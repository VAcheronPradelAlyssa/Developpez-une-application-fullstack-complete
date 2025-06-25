package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.dto.PostDTO;
import com.openclassrooms.mddapi.mapper.PostMapper;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
            .map(PostMapper::toDto)
            .toList();
    }

    public Optional<PostDTO> getPostById(Long id) {
        return postRepository.findById(id).map(PostMapper::toDto);
    }

    public PostDTO createPost(PostCreateDTO dto, User author, Subject subject) {
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(author);
        post.setSubject(subject);
        Post saved = postRepository.save(post);
        return PostMapper.toDto(saved);
    }
}
