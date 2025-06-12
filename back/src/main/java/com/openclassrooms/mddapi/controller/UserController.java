package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import com.openclassrooms.mddapi.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getId();
        User user = userService.getUserById(userId).orElseThrow();
        return ResponseEntity.ok(user);
    }

    // PUT /api/user/profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UserUpdateDTO dto, Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        User updated = userService.updateUser(principal.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    // GET /api/user/subscriptions
    @GetMapping("/subscriptions")
    public ResponseEntity<Set<Subscription>> getSubscriptions(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getSubscriptions(principal.getId()));
    }

    // DELETE /api/user/subscriptions/{subjectId}
    @DeleteMapping("/subscriptions/{subjectId}")
    public ResponseEntity<?> unsubscribe(Authentication authentication, @PathVariable Long subjectId) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        userService.unsubscribe(principal.getId(), subjectId);
        return ResponseEntity.ok().build();
    }
}