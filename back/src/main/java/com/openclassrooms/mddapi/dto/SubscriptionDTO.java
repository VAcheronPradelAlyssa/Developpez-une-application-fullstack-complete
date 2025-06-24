package com.openclassrooms.mddapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubscriptionDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
        private String description; // <-- doit exister ici

    private LocalDateTime subscribedAt;
}