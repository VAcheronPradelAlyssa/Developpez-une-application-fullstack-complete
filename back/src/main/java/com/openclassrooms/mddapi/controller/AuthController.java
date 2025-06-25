package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletResponse response) {
        UserDto userDto = authService.register(request);
        String token = authService.generateTokenFromDto(userDto);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // false en local
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24); // 1 jour
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("user", userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        UserDto userDto = authService.loginAndGetUserDto(request);
        if (userDto != null) {
            String token = authService.generateTokenFromDto(userDto);

            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // false en local
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24); // 1 jour
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of("user", userDto));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Identifiants invalides"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // false en local
        cookie.setPath("/");
        cookie.setMaxAge(0); // expire immédiatement
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }
}