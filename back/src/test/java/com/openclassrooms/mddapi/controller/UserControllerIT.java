package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
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
class UserControllerIT {

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
    private String token;

    @BeforeEach
    void setup() {
        subscriptionRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setUsername("userit");
        user.setEmail("userit@test.com");
        user.setPassword("$2a$10$abcdefghijklmnopqrstuv");
        user.setRole("USER");
        user = userRepository.save(user);

        token = JwtUtil.generateToken(user.getUsername(), user.getId());
    }

    @AfterEach
    void cleanup() {
        subscriptionRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getProfile_shouldReturnUser() throws Exception {
        mockMvc.perform(get("/api/user/profile")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("userit"))
            .andExpect(jsonPath("$.email").value("userit@test.com"));
    }

    @Test
    void updateProfile_shouldUpdateAndReturnUser() throws Exception {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setUsername("newname");
        dto.setEmail("newmail@test.com");

        mockMvc.perform(put("/api/user/profile")
                .cookie(new Cookie("token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("newname"))
            .andExpect(jsonPath("$.email").value("newmail@test.com"));

        User updated = userRepository.findById(user.getId()).orElseThrow();
        assertThat(updated.getUsername()).isEqualTo("newname");
        assertThat(updated.getEmail()).isEqualTo("newmail@test.com");
    }

    @Test
    void getSubscriptions_shouldReturnList() throws Exception {
        Subject subject = new Subject();
        subject.setName("SujetUser");
        subject.setDescription("desc");
        subject = subjectRepository.save(subject);

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setSubject(subject);
        sub.setSubscribedAt(java.time.LocalDateTime.now());
        subscriptionRepository.save(sub);

        mockMvc.perform(get("/api/user/subscriptions")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].subjectName").value("SujetUser"));
    }

    @Test
    void unsubscribe_shouldRemoveSubscription() throws Exception {
        Subject subject = new Subject();
        subject.setName("SujetToUnsub");
        subject.setDescription("desc");
        subject = subjectRepository.save(subject);

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setSubject(subject);
        sub.setSubscribedAt(java.time.LocalDateTime.now());
        subscriptionRepository.save(sub);

        mockMvc.perform(delete("/api/user/subscriptions/" + subject.getId())
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk());

        List<Subscription> subs = subscriptionRepository.findByUser(user);
        assertThat(subs).isEmpty();
    }
}
