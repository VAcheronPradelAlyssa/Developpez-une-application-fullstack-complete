package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.dto.SubscriptionDTO;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import com.openclassrooms.mddapi.service.UserService;
import com.openclassrooms.mddapi.service.TokenBlacklistService;
import com.openclassrooms.mddapi.service.SubscriptionService;
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
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(UserControllerTest.NoSecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @MockBean
    private SubscriptionService subscriptionService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private CustomUserPrincipal principal;
    private Subscription subscription;
    private Subject subject;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("mockuser");
        user.setEmail("mock@user.com");
        user.setPassword("pwd");
        user.setRole("USER");
        principal = new CustomUserPrincipal(1L, "mockuser");

        subject = new Subject();
        subject.setId(2L);
        subject.setName("SujetTest");
        subject.setDescription("desc");

        subscription = new Subscription();
        subscription.setId(3L);
        subscription.setUser(user);
        subscription.setSubject(subject);
        subscription.setSubscribedAt(java.time.LocalDateTime.now());
    }

    @Test
    void getProfile_shouldReturnUser() throws Exception {
        // Assuming your controller expects a UserDto, create a UserDto instance and return it
        com.openclassrooms.mddapi.dto.UserDto userDto = new com.openclassrooms.mddapi.dto.UserDto();
        userDto.setId(1L);
        userDto.setUsername("mockuser");
        userDto.setEmail("mock@user.com");
        when(userService.getUserById(1L)).thenReturn(userDto);

        mockMvc.perform(get("/api/user/profile")
                .with(SecurityMockMvcRequestPostProcessors.authentication(
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                principal, null, java.util.List.of()
                        )
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("mockuser"))
            .andExpect(jsonPath("$.email").value("mock@user.com"));
    }

    @Test
    void updateProfile_shouldUpdateAndReturnUser() throws Exception {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setUsername("newname");
        dto.setEmail("newmail@test.com");

        com.openclassrooms.mddapi.dto.UserDto updatedDto = new com.openclassrooms.mddapi.dto.UserDto();
        updatedDto.setId(1L);
        updatedDto.setUsername("newname");
        updatedDto.setEmail("newmail@test.com");

        when(userService.updateUser(Mockito.eq(1L), any(UserUpdateDTO.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/user/profile")
                .with(SecurityMockMvcRequestPostProcessors.authentication(
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                principal, null, java.util.List.of()
                        )
                ))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("newname"))
            .andExpect(jsonPath("$.email").value("newmail@test.com"));
    }

    @Test
    void getSubscriptions_shouldReturnList() throws Exception {
        // Mock pour retourner une liste de Subscription (pas DTO)
        when(userService.getSubscriptions(1L)).thenReturn(List.of(subscription));

        mockMvc.perform(get("/api/user/subscriptions")
                .with(SecurityMockMvcRequestPostProcessors.authentication(
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                principal, null, java.util.List.of()
                        )
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].subjectName").value("SujetTest"));
    }

    @Test
    void unsubscribe_shouldReturnOk() throws Exception {
        Mockito.doNothing().when(userService).unsubscribe(1L, 2L);

        mockMvc.perform(delete("/api/user/subscriptions/2")
                .with(SecurityMockMvcRequestPostProcessors.authentication(
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                principal, null, java.util.List.of()
                        )
                )))
            .andExpect(status().isOk());
    }

    @TestConfiguration
    static class NoSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}
       
