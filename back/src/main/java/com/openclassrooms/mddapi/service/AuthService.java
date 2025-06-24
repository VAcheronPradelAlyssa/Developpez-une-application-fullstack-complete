package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.util.JwtUtil;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Nom d'utilisateur déjà utilisé");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        User savedUser = userRepository.save(user);
        return UserMapper.toDto(savedUser);
    }

    public String login(LoginRequest request) {
        Optional<User> userOpt = getUserByEmailOrUsername(request.getEmailOrUsername());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            return JwtUtil.generateToken(user.getUsername(), user.getId());
        }
        return null;
    }

    public UserDto loginAndGetUserDto(LoginRequest request) {
        Optional<User> userOpt = getUserByEmailOrUsername(request.getEmailOrUsername());
        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return UserMapper.toDto(userOpt.get());
        }
        return null;
    }

    public String generateToken(User user) {
        return JwtUtil.generateToken(user.getUsername(), user.getId());
    }

    public String generateTokenFromDto(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("userDto ne doit pas être null");
        }
        return JwtUtil.generateToken(userDto.getUsername(), userDto.getId());
    }

    public Optional<User> getUserByEmailOrUsername(String emailOrUsername) {
        Optional<User> userOpt = userRepository.findByEmail(emailOrUsername);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(emailOrUsername);
        }
        return userOpt;
    }
}