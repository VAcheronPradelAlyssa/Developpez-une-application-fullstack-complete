package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.model.Subject;

public class SubjectMapper {

    public static SubjectDTO toDto(Subject subject) {
        if (subject == null) return null;
        SubjectDTO dto = new SubjectDTO();
        dto.id = subject.getId();
        dto.name = subject.getName();
        dto.description = subject.getDescription();
        return dto;
    }

    public static Subject toEntity(SubjectDTO dto) {
        if (dto == null) return null;
        Subject subject = new Subject();
        subject.setId(dto.id);
        subject.setName(dto.name);
        subject.setDescription(dto.description);
        return subject;
    }
}