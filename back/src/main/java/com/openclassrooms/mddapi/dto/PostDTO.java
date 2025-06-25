package com.openclassrooms.mddapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Long authorId;
    private String authorUsername;
    private Long subjectId;
    private String subjectName;
}
