package com.openclassrooms.mddapi.controller;

import java.security.Principal;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import com.openclassrooms.mddapi.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/{subjectId}")
    public ResponseEntity<?> subscribe(@PathVariable Long subjectId, Principal principal) {
        subscriptionService.subscribe(subjectId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> unsubscribe(@PathVariable Long subjectId, Principal principal) {
        subscriptionService.unsubscribe(subjectId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Set<Long>> getUserSubscriptions(Principal principal) {
        return ResponseEntity.ok(subscriptionService.getSubscribedSubjectIds(principal.getName()));
    }
}