// src/main/java/com/openclassrooms/mddapi/dto/SubscriptionDTO.java
package com.openclassrooms.mddapi.dto;

import com.openclassrooms.mddapi.model.Subject;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubscriptionDTO {
    private Long id;
    private Subject subject;
    private LocalDateTime subscribedAt;

    public SubscriptionDTO(Long id, Subject subject, LocalDateTime subscribedAt) {
        this.id = id;
        this.subject = subject;
        this.subscribedAt = subscribedAt;
    }

    public SubscriptionDTO(com.openclassrooms.mddapi.model.Subscription sub) {
        this.id = sub.getId();
        this.subject = sub.getSubject();
        this.subscribedAt = sub.getSubscribedAt();
    }
}