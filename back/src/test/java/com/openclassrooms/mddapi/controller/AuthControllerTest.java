package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.AuthService;
import com.openclassrooms.mddapi.service.TokenBlacklistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(AuthControllerTest.NoSecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @TestConfiguration
    static class NoSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("test");
        user.setEmail("test@test.com");
        user.setPassword("encodedpass");
        user.setRole("USER");
    }

    @Test
    void register_shouldReturnUserAndSetCookie() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@test.com");
        req.setUsername("test");
        req.setPassword("pass");
        when(authService.register(any())).thenReturn(user);
        when(authService.generateToken(any())).thenReturn("token");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(cookie().exists("token"))
            .andExpect(jsonPath("$.user.username").value("test"));
    }

    @Test
    void register_shouldReturnErrorIfEmailExists() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("exists@test.com");
        req.setUsername("test");
        req.setPassword("pass");
        when(authService.register(any())).thenThrow(new RuntimeException("Email déjà utilisé"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Email déjà utilisé"));
    }

    @Test
    void login_shouldReturnUserAndSetCookie() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmailOrUsername("test@test.com");
        req.setPassword("pass");
        when(authService.login(any())).thenReturn("token");
        when(authService.getUserByEmailOrUsername(any())).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(cookie().exists("token"))
            .andExpect(jsonPath("$.user.username").value("test"));
    }

    @Test
    void login_shouldReturnUnauthorizedOnBadCredentials() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmailOrUsername("bad");
        req.setPassword("bad");
        when(authService.login(any())).thenReturn(null);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("Identifiants invalides"));
    }

    @Test
    void login_shouldReturnErrorIfUserNotFound() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmailOrUsername("notfound");
        req.setPassword("pass");
        when(authService.login(any())).thenReturn("token");
        when(authService.getUserByEmailOrUsername("notfound")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").isEmpty());
    }

    @Test
    void logout_shouldClearCookie() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
            .andExpect(status().isOk())
            .andExpect(cookie().value("token", ""));
    }
}
