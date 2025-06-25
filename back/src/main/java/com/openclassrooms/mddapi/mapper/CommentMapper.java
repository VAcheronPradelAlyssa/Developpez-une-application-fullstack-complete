package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.Comment;

public class CommentMapper {

    public static CommentDTO toDto(Comment comment) {
        if (comment == null) return null;
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorUsername(comment.getAuthor().getUsername());
        }
        if (comment.getPost() != null) {
            dto.setPostId(comment.getPost().getId());
        }
        return dto;
    }
}