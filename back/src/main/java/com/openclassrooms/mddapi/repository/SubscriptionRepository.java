package com.openclassrooms.mddapi.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.User;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByUserAndSubject(User user, Subject subject);
    Optional<Subscription> findByUserAndSubject(User user, Subject subject);
    Set<Subscription> findByUser(User user);
}