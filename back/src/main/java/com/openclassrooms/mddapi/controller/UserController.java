package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    // GET /api/user/profile
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Principal principal) {
        User user = userService.getUserByUsername(principal.getName())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(user);
    }

    // PUT /api/user/profile?userId=X
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestParam Long userId, @RequestBody UserUpdateDTO dto) {
        User updated = userService.updateUser(userId, dto);
        return ResponseEntity.ok(updated);
    }

    // GET /api/user/subscriptions
    @GetMapping("/subscriptions")
    public ResponseEntity<Set<Subscription>> getSubscriptions(Principal principal) {
        return ResponseEntity.ok(userService.getSubscriptions(principal.getName()));
    }

    // DELETE /api/user/subscriptions/{subjectId}?userId=X
    @DeleteMapping("/subscriptions/{subjectId}")
    public ResponseEntity<?> unsubscribe(@RequestParam Long userId, @PathVariable Long subjectId) {
        userService.unsubscribe(userId, subjectId);
        return ResponseEntity.ok().build();
    }
}