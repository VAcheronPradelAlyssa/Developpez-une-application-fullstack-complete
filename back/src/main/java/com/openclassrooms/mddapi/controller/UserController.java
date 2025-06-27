package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.SubscriptionDTO;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.dto.UserUpdateDTO;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import com.openclassrooms.mddapi.service.UserService;
import com.openclassrooms.mddapi.mapper.SubscriptionMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Utilisateurs", description = "API de gestion des profils utilisateurs")
@SecurityRequirement(name = "cookieAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
        summary = "Récupérer le profil de l'utilisateur connecté",
        description = "Retourne les informations complètes du profil de l'utilisateur actuellement authentifié " +
                     "(nom d'utilisateur, email, etc.). Utilisé pour afficher et gérer le profil utilisateur."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Profil utilisateur retourné avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"username\": \"john_doe\", \"email\": \"john@example.com\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Token invalide\"}")
            )
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Utilisateur non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Utilisateur introuvable\"}")
            )
        )
    })
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getId();
        UserDto userDto = userService.getUserById(userId);
        if (userDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userDto);
    }

    @Operation(
        summary = "Mettre à jour le profil utilisateur",
        description = "Permet à l'utilisateur de modifier son nom d'utilisateur, email et/ou mot de passe. " +
                     "Seuls les champs fournis seront mis à jour. Le mot de passe sera automatiquement hashé."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Profil mis à jour avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"username\": \"john_updated\", \"email\": \"john.new@example.com\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Données invalides (format email, mot de passe trop faible)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Format email invalide\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Authentification requise\"}")
            )
        ),
        @ApiResponse(
            responseCode = "409", 
            description = "Email ou nom d'utilisateur déjà existant",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Email déjà utilisé\"}")
            )
        )
    })
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
        @Parameter(
            description = "Nouvelles informations de profil (champs optionnels)", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"username\": \"nouveau_nom\", \"email\": \"nouveau@email.com\", \"password\": \"NouveauMotDePasse123!\"}")
            )
        )
        @Valid @RequestBody UserUpdateDTO dto, 
        Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        UserDto updated = userService.updateUser(principal.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "Récupérer les abonnements de l'utilisateur",
        description = "Retourne la liste détaillée de tous les sujets auxquels l'utilisateur connecté est abonné, " +
                     "avec les informations des sujets et dates d'abonnement."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Liste des abonnements récupérée avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "[{\"id\": 1, \"subjectId\": 1, \"subjectName\": \"Java\", \"description\": \"Langage de programmation\", \"subscribedAt\": \"2024-01-15T10:00:00\"}]")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Token invalide\"}")
            )
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Utilisateur non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Utilisateur introuvable\"}")
            )
        )
    })
    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptions(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        Long userId = principal.getId();
        List<Subscription> subs = userService.getSubscriptions(userId)
            .stream().toList();
        List<SubscriptionDTO> dtos = subs.stream()
            .filter(sub -> sub != null && sub.getSubject() != null)
            .map(SubscriptionMapper::toDto)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @Operation(
        summary = "Se désabonner d'un sujet",
        description = "Permet à l'utilisateur de se désabonner d'un sujet spécifique. " +
                     "L'utilisateur ne recevra plus les nouveaux articles de ce sujet."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Désabonnement effectué avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Désabonnement réussi\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Authentification requise\"}")
            )
        ),
        @ApiResponse(
            responseCode = "404", 
            description = "Abonnement non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Abonnement introuvable\"}")
            )
        )
    })
    @DeleteMapping("/subscriptions/{subjectId}")
    public ResponseEntity<?> unsubscribe(
        Authentication authentication,
        @Parameter(
            description = "ID du sujet duquel se désabonner", 
            required = true,
            example = "1"
        )
        @PathVariable Long subjectId
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        userService.unsubscribe(principal.getId(), subjectId);
        return ResponseEntity.ok().build();
    }
}
