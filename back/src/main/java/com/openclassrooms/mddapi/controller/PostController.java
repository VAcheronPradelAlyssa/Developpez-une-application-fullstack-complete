package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.dto.PostDTO;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Tag(name = "Articles", description = "API de gestion des articles")
@SecurityRequirement(name = "cookieAuth")
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public PostController(PostService postService, UserRepository userRepository, SubjectRepository subjectRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @Operation(
        summary = "Récupérer tous les articles",
        description = "Retourne la liste de tous les articles publiés avec leurs informations complètes (titre, contenu, auteur, sujet, date de création). " +
                     "Les articles sont triés par date de création décroissante."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Liste des articles récupérée avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "[{\"id\": 1, \"title\": \"Introduction à Spring Boot\", \"content\": \"Spring Boot facilite...\", \"author\": {\"username\": \"john\"}, \"subject\": {\"name\": \"Java\"}, \"createdAt\": \"2024-01-15T10:00:00\"}]")
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
            responseCode = "403", 
            description = "Accès interdit",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Accès refusé\"}")
            )
        )
    })
    @GetMapping
    public List<PostDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @Operation(
        summary = "Créer un nouvel article",
        description = "Permet à un utilisateur authentifié de créer un nouvel article avec un titre, contenu et sujet. " +
                     "L'article sera automatiquement associé à l'utilisateur connecté comme auteur."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Article créé avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 2, \"title\": \"Les nouveautés Angular 17\", \"content\": \"Angular 17 apporte...\", \"author\": {\"username\": \"jane\"}, \"subject\": {\"name\": \"Angular\"}, \"createdAt\": \"2024-01-15T11:00:00\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Données de la requête invalides (titre/contenu manquant, sujet inexistant)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Le titre est requis\"}")
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
        )
    })
    @PostMapping
    public ResponseEntity<PostDTO> createPost(
        @Parameter(
            description = "Données de l'article à créer (titre, contenu, ID du sujet)", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"title\": \"Guide complet Docker\", \"content\": \"Docker est un outil de conteneurisation...\", \"subjectId\": 1}")
            )
        )
        @Valid @RequestBody PostCreateDTO dto, 
        Authentication authentication
    ) {
        Long userId = ((com.openclassrooms.mddapi.security.CustomUserPrincipal) authentication.getPrincipal()).getId();
        User author = userRepository.findById(userId).orElseThrow();
        Subject subject = subjectRepository.findById(dto.getSubjectId()).orElseThrow();
        PostDTO postDto = postService.createPost(dto, author, subject);
        return ResponseEntity.ok(postDto);
    }

    @Operation(
        summary = "Récupérer un article par son ID",
        description = "Retourne les détails complets d'un article spécifique avec ses informations (titre, contenu, auteur, sujet). " +
                     "Utilisé pour afficher la page de détail d'un article."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Article trouvé et retourné",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 1, \"title\": \"Microservices avec Spring Cloud\", \"content\": \"Les microservices...\", \"author\": {\"username\": \"alice\"}, \"subject\": {\"name\": \"Microservices\"}, \"createdAt\": \"2024-01-15T09:00:00\"}")
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
            description = "Article non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Article introuvable\"}")
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(
        @Parameter(
            description = "ID de l'article à récupérer", 
            required = true,
            example = "1"
        )
        @PathVariable Long id
    ) {
        return postService.getPostById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}