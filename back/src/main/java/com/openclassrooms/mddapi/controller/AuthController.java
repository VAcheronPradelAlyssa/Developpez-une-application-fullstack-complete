package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.LoginRequest;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentification", description = "API de gestion de l'authentification et de l'inscription")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(
        summary = "Inscription d'un nouvel utilisateur",
        description = "Permet à un nouveau visiteur de créer un compte avec email, nom d'utilisateur et mot de passe. " +
                     "En cas de succès, l'utilisateur est automatiquement connecté avec un token JWT."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Compte créé avec succès, utilisateur connecté automatiquement",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"user\": {\"id\": 1, \"username\": \"john\", \"email\": \"john@example.com\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Données invalides (email/username déjà utilisé, mot de passe faible)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Email déjà utilisé\"}")
            )
        ),
        @ApiResponse(
            responseCode = "409", 
            description = "Conflit - Email ou nom d'utilisateur déjà existant",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Nom d'utilisateur déjà pris\"}")
            )
        )
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Parameter(
            description = "Informations d'inscription de l'utilisateur", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"username\": \"john\", \"email\": \"john@example.com\", \"password\": \"SecurePass123!\"}")
            )
        )
        @Valid @RequestBody RegisterRequest request, 
        HttpServletResponse response
    ) {
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

    @Operation(
        summary = "Connexion d'un utilisateur",
        description = "Authentifie un utilisateur avec son email ou nom d'utilisateur et son mot de passe. " +
                     "En cas de succès, retourne les informations utilisateur et définit un cookie JWT sécurisé."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Connexion réussie, token JWT retourné via cookie",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"user\": {\"id\": 1, \"username\": \"john\", \"email\": \"john@example.com\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Identifiants incorrects",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Identifiants invalides\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Format de requête invalide",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Données manquantes\"}")
            )
        )
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
        @Parameter(
            description = "Identifiants de connexion (email ou username + mot de passe)", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"emailOrUsername\": \"john@example.com\", \"password\": \"SecurePass123!\"}")
            )
        )
        @Valid @RequestBody LoginRequest request, 
        HttpServletResponse response
    ) {
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

    @Operation(
        summary = "Déconnexion de l'utilisateur",
        description = "Déconnecte l'utilisateur actuel en supprimant le token JWT du cookie. " +
                     "Cette action est irréversible et nécessite une nouvelle connexion."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Déconnexion réussie",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Déconnexion réussie\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié (déjà déconnecté)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Token invalide\"}")
            )
        )
    })
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