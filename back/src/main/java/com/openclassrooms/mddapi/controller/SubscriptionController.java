package com.openclassrooms.mddapi.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<Set<Long>> getUserSubscriptions(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(subscriptionService.getSubscribedSubjectIds(principal.getId()));
    }
}