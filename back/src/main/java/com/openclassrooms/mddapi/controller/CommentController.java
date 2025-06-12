package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import com.openclassrooms.mddapi.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentController(CommentService commentService, UserRepository userRepository, PostRepository postRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody CommentCreateDTO dto, Authentication authentication) {
        // Récupérer l'id utilisateur depuis le principal
        Long userId = ((CustomUserPrincipal) authentication.getPrincipal()).getId();
        User author = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        Comment comment = commentService.createComment(dto, author, post);
        return ResponseEntity.ok(comment);
    }
}