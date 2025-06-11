package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable Long postId,
            @RequestBody CommentCreateDTO dto
    ) {
        // dto doit contenir userId et content
        return commentService.addComment(postId, dto.getUserId(), dto.getContent())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
}