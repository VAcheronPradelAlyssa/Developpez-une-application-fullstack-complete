package com.openclassrooms.mddapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Champ pour le nom du thème
    @Column(nullable = false, unique = true)
    private String name;

    // Champ pour la description du thème
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private Set<Subscription> subscriptions;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private Set<Post> posts;
}