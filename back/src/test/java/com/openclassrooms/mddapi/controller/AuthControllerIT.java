package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @LocalServerPort
    int port;

    @BeforeEach
    void cleanDbBefore() {
        userRepository.deleteAll();
    }

    @AfterEach
    void cleanDbAfter() {
        userRepository.deleteAll();
    }

    @Test
    void contextLoads() {
        // Test de démarrage du contexte et injection du controller
    }

    @Test
    void register_and_login_and_logout_flow() throws Exception {
        // Register
        RegisterRequest register = new RegisterRequest();
        register.setEmail("integration@test.com");
        register.setUsername("integration");
        register.setPassword("ValidPassword123!"); // Mot de passe valide
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isOk())
            .andExpect(cookie().exists("token"))
            .andExpect(jsonPath("$.user.username").value("integration"));

        // Login
        LoginRequest login = new LoginRequest();
        login.setEmailOrUsername("integration@test.com");
        login.setPassword("ValidPassword123!"); // Mot de passe valide
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andExpect(cookie().exists("token"))
            .andExpect(jsonPath("$.user.username").value("integration"));

        // Logout
        mockMvc.perform(post("/api/auth/logout"))
            .andExpect(status().isOk())
            .andExpect(cookie().value("token", ""));
    }

    @Test
    void login_shouldReturnUnauthorizedOnBadCredentials() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmailOrUsername("doesnotexist@test.com");
        req.setPassword("wrongpass");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").exists());
    }
}
