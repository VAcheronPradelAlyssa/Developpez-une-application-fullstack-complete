package com.openclassrooms.mddapi.mapper;

import com.openclassrooms.mddapi.dto.SubscriptionDTO;
import com.openclassrooms.mddapi.model.Subscription;

public class SubscriptionMapper {
    public static SubscriptionDTO toDto(Subscription sub) {
        if (sub == null) return null;
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(sub.getId());
        if (sub.getSubject() != null) {
            dto.setSubjectId(sub.getSubject().getId());
            dto.setSubjectName(sub.getSubject().getName());
            dto.setDescription(sub.getSubject().getDescription());
        }
        dto.setSubscribedAt(sub.getSubscribedAt());
        return dto;
    }
}
