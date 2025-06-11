package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, SubjectRepository subjectRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(PostCreateDTO dto) {
        User author = userRepository.findById(dto.authorId)
            .orElseThrow(() -> new RuntimeException("Author not found"));
        Subject subject = subjectRepository.findById(dto.subjectId)
            .orElseThrow(() -> new RuntimeException("Subject not found"));

        Post post = new Post();
        post.setTitle(dto.title);
        post.setContent(dto.content);
        post.setCreatedAt(LocalDateTime.now());
        post.setAuthor(author);
        post.setSubject(subject);

        return postRepository.save(post);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }
}
