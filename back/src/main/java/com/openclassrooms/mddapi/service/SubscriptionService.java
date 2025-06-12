package com.openclassrooms.mddapi.service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public void subscribe(Long subjectId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le username : " + username));
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new RuntimeException("Sujet non trouvé avec l'id : " + subjectId));

        if (subscriptionRepository.existsByUserAndSubject(user, subject)) return;

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setSubject(subject);
        subscription.setSubscribedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
    }

    public void unsubscribe(Long subjectId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le username : " + username));
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new RuntimeException("Sujet non trouvé avec l'id : " + subjectId));

        Subscription sub = subscriptionRepository.findByUserAndSubject(user, subject)
            .orElseThrow(() -> new RuntimeException("Abonnement non trouvé pour l'utilisateur et le sujet"));
        subscriptionRepository.delete(sub);
    }

    public Set<Long> getSubscribedSubjectIds(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le username : " + username));
        return subscriptionRepository.findByUser(user)
            .stream()
            .map(s -> s.getSubject().getId())
            .collect(Collectors.toSet());
    }
}
