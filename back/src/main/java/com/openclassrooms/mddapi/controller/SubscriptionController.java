package com.openclassrooms.mddapi.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import com.openclassrooms.mddapi.dto.SubscriptionDTO;
import com.openclassrooms.mddapi.service.SubscriptionService;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Abonnements", description = "API de gestion des abonnements aux sujets")
@SecurityRequirement(name = "cookieAuth")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Operation(
        summary = "S'abonner à un sujet",
        description = "Permet à l'utilisateur connecté de s'abonner à un sujet pour recevoir ses nouveaux articles. " +
                     "Si l'utilisateur est déjà abonné, cette action n'aura aucun effet."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Abonnement créé avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Abonnement réussi\"}")
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
            description = "Sujet non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Sujet introuvable\"}")
            )
        ),
        @ApiResponse(
            responseCode = "409", 
            description = "Déjà abonné à ce sujet",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Déjà abonné à ce sujet\"}")
            )
        )
    })
    @PostMapping("/{subjectId}")
    public ResponseEntity<?> subscribe(
        @Parameter(
            description = "ID du sujet auquel s'abonner", 
            required = true,
            example = "1"
        )
        @PathVariable Long subjectId, 
        Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        subscriptionService.subscribe(subjectId, principal.getId());
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Se désabonner d'un sujet",
        description = "Permet à l'utilisateur connecté de se désabonner d'un sujet. " +
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
            description = "Sujet non trouvé ou pas d'abonnement existant",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Abonnement introuvable\"}")
            )
        )
    })
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<?> unsubscribe(
        @Parameter(
            description = "ID du sujet duquel se désabonner", 
            required = true,
            example = "1"
        )
        @PathVariable Long subjectId, 
        Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        subscriptionService.unsubscribe(subjectId, principal.getId());
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Récupérer les abonnements de l'utilisateur",
        description = "Retourne la liste détaillée de tous les sujets auxquels l'utilisateur connecté est abonné, " +
                     "avec les informations complètes des sujets et dates d'abonnement."
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
    @GetMapping
    public ResponseEntity<Set<SubscriptionDTO>> getUserSubscriptions(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(principal.getId()));
    }

    @Operation(
        summary = "Récupérer les IDs des sujets abonnés",
        description = "Retourne uniquement la liste des IDs des sujets auxquels l'utilisateur est abonné. " +
                     "Version allégée pour les vérifications rapides côté client."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Liste des IDs des sujets abonnés",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "[1, 3, 5]")
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Non authentifié",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Token invalide\"}")
            )
        )
    })
    @GetMapping("/ids")
    public ResponseEntity<Set<Long>> getUserSubscriptionIds(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(subscriptionService.getSubscribedSubjectIds(principal.getId()));
    }
}