package com.openclassrooms.mddapi.dto;

import lombok.Data;

@Data
public class CommentCreateDTO {
    private Long userId;
    private String content;
}