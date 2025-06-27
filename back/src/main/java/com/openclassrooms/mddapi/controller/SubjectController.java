package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.SubjectDTO;
import com.openclassrooms.mddapi.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@Tag(name = "Sujets", description = "API de gestion des sujets et thèmes")
@SecurityRequirement(name = "cookieAuth")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @Operation(
        summary = "Créer un nouveau sujet",
        description = "Permet de créer un nouveau sujet/thème avec un nom et une description. " +
                     "Ce sujet pourra ensuite être utilisé pour catégoriser les articles."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Sujet créé avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"name\": \"React\", \"description\": \"Framework JavaScript pour construire des interfaces utilisateur\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Données invalides (nom manquant ou déjà existant)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Le nom du sujet est requis\"}")
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
            description = "Conflit - Sujet déjà existant",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Un sujet avec ce nom existe déjà\"}")
            )
        )
    })
    @PostMapping
    public ResponseEntity<SubjectDTO> createSubject(
        @Parameter(
            description = "Données du sujet à créer (nom et description)", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"name\": \"Vue.js\", \"description\": \"Framework JavaScript progressif pour construire des interfaces utilisateur\"}")
            )
        )
        @Valid @RequestBody SubjectDTO dto
    ) {
        return ResponseEntity.ok(subjectService.createSubject(dto));
    }

    @Operation(
        summary = "Récupérer tous les sujets",
        description = "Retourne la liste complète de tous les sujets disponibles avec leurs noms et descriptions. " +
                     "Utilisé pour l'affichage des sujets disponibles et la sélection lors de la création d'articles."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Liste des sujets récupérée avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "[{\"id\": 1, \"name\": \"Java\", \"description\": \"Langage de programmation orienté objet\"}, {\"id\": 2, \"name\": \"Spring Boot\", \"description\": \"Framework Java pour développement rapide\"}]")
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
    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @Operation(
        summary = "Récupérer un sujet par son ID",
        description = "Retourne les détails d'un sujet spécifique avec son nom et sa description. " +
                     "Utilisé pour afficher les informations détaillées d'un sujet."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Sujet trouvé et retourné",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"name\": \"Angular\", \"description\": \"Framework de développement d'applications web par Google\"}")
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
            description = "Sujet non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Sujet introuvable\"}")
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<SubjectDTO> getSubjectById(
        @Parameter(
            description = "ID du sujet à récupérer", 
            required = true,
            example = "1"
        )
        @PathVariable Long id
    ) {
        SubjectDTO subject = subjectService.getSubjectById(id);
        if (subject == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subject);
    }
}