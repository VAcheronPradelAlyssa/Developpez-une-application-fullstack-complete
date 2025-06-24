package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SubscriptionControllerIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    private User user;
    private Subject subject1;
    private Subject subject2;
    private String token;

    @BeforeEach
    void setup() {
        subscriptionRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setUsername("subuser");
        user.setEmail("subuser@test.com");
        user.setPassword("$2a$10$abcdefghijklmnopqrstuv");
        user.setRole("USER");
        user = userRepository.save(user);

        subject1 = new Subject();
        subject1.setName("SujetA");
        subject1.setDescription("descA");
        subject1 = subjectRepository.save(subject1);

        subject2 = new Subject();
        subject2.setName("SujetB");
        subject2.setDescription("descB");
        subject2 = subjectRepository.save(subject2);

        token = JwtUtil.generateToken(user.getUsername(), user.getId());
    }

    @AfterEach
    void cleanup() {
        subscriptionRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void subscribe_shouldCreateSubscription() throws Exception {
        mockMvc.perform(post("/api/subscriptions/" + subject1.getId())
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk());

        List<Subscription> subs = subscriptionRepository.findByUser(user);
        assertThat(subs).hasSize(1);
        assertThat(subs.get(0).getSubject().getId()).isEqualTo(subject1.getId());
    }

    @Test
    void getUserSubscriptions_shouldReturnIds() throws Exception {
        // Prépare un abonnement
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setSubject(subject1);
        sub.setSubscribedAt(java.time.LocalDateTime.now());
        subscriptionRepository.save(sub);

        mockMvc.perform(get("/api/subscriptions")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0]").value(subject1.getId().intValue()));
    }

    @Test
    void unsubscribe_shouldRemoveSubscription() throws Exception {
        // Prépare un abonnement
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setSubject(subject2);
        sub.setSubscribedAt(java.time.LocalDateTime.now());
        subscriptionRepository.save(sub);

        mockMvc.perform(delete("/api/subscriptions/" + subject2.getId())
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk());

        List<Subscription> subs = subscriptionRepository.findByUser(user);
        assertThat(subs).isEmpty();
    }
}
