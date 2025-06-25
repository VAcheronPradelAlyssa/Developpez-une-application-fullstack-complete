package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository userRepository;
    private SubscriptionRepository subscriptionRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        subscriptionRepository = mock(SubscriptionRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        userService = new UserService(userRepository, subscriptionRepository, passwordEncoder);
    }

    @Test
    void getUserById_returnsUser() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        // Assuming UserDto has a getId() method
        var result = userService.getUserById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void updateUser_updatesFields() {
        User user = new User();
        user.setId(1L);
        user.setUsername("old");
        user.setEmail("old@test.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setUsername("new");
        dto.setEmail("new@test.com");
        dto.setPassword("pass");
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        var updated = userService.updateUser(1L, dto);
        assertEquals("new", updated.getUsername());
        assertEquals("new@test.com", updated.getEmail());
        // Password should not be exposed in UserDto, so we do not check it here
    }
}
