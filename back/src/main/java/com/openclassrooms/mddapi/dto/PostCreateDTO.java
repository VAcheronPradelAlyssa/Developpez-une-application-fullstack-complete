package com.openclassrooms.mddapi.dto;
import lombok.Data;

@Data
public class PostCreateDTO {
    public String title;
    public String content;
    public Long subjectId;
    public Long authorId;
}