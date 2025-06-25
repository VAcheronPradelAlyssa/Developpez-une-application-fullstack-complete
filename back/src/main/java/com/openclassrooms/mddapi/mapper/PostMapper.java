package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.PostDTO;
import com.openclassrooms.mddapi.model.Post;

public class PostMapper {
    public static PostDTO toDto(Post post) {
        if (post == null) return null;
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        if (post.getAuthor() != null) {
            dto.setAuthorId(post.getAuthor().getId());
            dto.setAuthorUsername(post.getAuthor().getUsername());
        }
        if (post.getSubject() != null) {
            dto.setSubjectId(post.getSubject().getId());
            dto.setSubjectName(post.getSubject().getName());
        }
        return dto;
    }
}
