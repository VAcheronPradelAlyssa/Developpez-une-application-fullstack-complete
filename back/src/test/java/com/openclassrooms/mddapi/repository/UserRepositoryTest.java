package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserRepositoryTest {

    private UserRepository userRepository;

    @BeforeEach
    void setup() {
        userRepository = mock(UserRepository.class);
    }

    @Test
    void findById_shouldReturnUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userRepository.findById(1L);
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("testuser");
    }

    @Test
    void findByEmail_shouldReturnUser() {
        User user = new User();
        user.setEmail("test@mail.com");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));

        Optional<User> result = userRepository.findByEmail("test@mail.com");
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("test@mail.com");
    }

    @Test
    void existsByUsername_shouldReturnTrueIfExists() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        assertThat(userRepository.existsByUsername("testuser")).isTrue();
    }
}
