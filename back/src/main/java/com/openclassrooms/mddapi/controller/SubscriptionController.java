package com.openclassrooms.mddapi.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import com.openclassrooms.mddapi.dto.SubscriptionDTO;
import com.openclassrooms.mddapi.service.SubscriptionService;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/{subjectId}")
    public ResponseEntity<?> subscribe(@PathVariable Long subjectId, Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        subscriptionService.subscribe(subjectId, principal.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> unsubscribe(@PathVariable Long subjectId, Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        subscriptionService.unsubscribe(subjectId, principal.getId());
        return ResponseEntity.ok().build();
    }

    // Retourne la liste détaillée des abonnements
    @GetMapping
    public ResponseEntity<Set<SubscriptionDTO>> getUserSubscriptions(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(principal.getId()));
    }

    // Si tu veux garder aussi l'ancienne route pour les IDs uniquement :
    @GetMapping("/ids")
    public ResponseEntity<Set<Long>> getUserSubscriptionIds(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(subscriptionService.getSubscribedSubjectIds(principal.getId()));
    }
}