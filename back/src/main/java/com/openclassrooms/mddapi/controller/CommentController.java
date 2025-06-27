package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.security.CustomUserPrincipal;
import com.openclassrooms.mddapi.service.CommentService;
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
@RequestMapping("/api/posts/{postId}/comments")
@Tag(name = "Commentaires", description = "API de gestion des commentaires d'articles")
@SecurityRequirement(name = "cookieAuth")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentController(CommentService commentService, UserRepository userRepository, PostRepository postRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @Operation(
        summary = "Récupérer les commentaires d'un article",
        description = "Retourne tous les commentaires associés à un article spécifique, triés par date de création. " +
                     "Chaque commentaire contient l'auteur et le contenu."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Liste des commentaires récupérée avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "[{\"id\": 1, \"content\": \"Super article !\", \"author\": {\"username\": \"john\"}, \"createdAt\": \"2024-01-15T10:30:00\"}]")
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
    @GetMapping
    public List<CommentDTO> getCommentsByPost(
        @Parameter(
            description = "ID de l'article dont récupérer les commentaires", 
            required = true,
            example = "1"
        )
        @PathVariable Long postId
    ) {
        return commentService.getCommentsByPostId(postId);
    }

    @Operation(
        summary = "Ajouter un commentaire à un article",
        description = "Permet à un utilisateur authentifié d'ajouter un nouveau commentaire sur un article. " +
                     "Le commentaire sera associé à l'utilisateur connecté et à l'article spécifié."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Commentaire ajouté avec succès",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"id\": 2, \"content\": \"Excellent article, merci !\", \"author\": {\"username\": \"jane\"}, \"createdAt\": \"2024-01-15T11:00:00\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Contenu du commentaire invalide (vide ou trop long)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Le commentaire ne peut pas être vide\"}")
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
            description = "Article non trouvé",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Article introuvable\"}")
            )
        )
    })
    @PostMapping
    public ResponseEntity<CommentDTO> addComment(
        @Parameter(
            description = "ID de l'article à commenter", 
            required = true,
            example = "1"
        )
        @PathVariable Long postId,
        @Parameter(
            description = "Contenu du commentaire à ajouter", 
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"content\": \"Très bon article, j'ai appris beaucoup de choses !\"}")
            )
        )
        @Valid @RequestBody CommentCreateDTO dto,
        Authentication authentication
    ) {
        // Récupérer l'id utilisateur depuis le principal
        Long userId = ((CustomUserPrincipal) authentication.getPrincipal()).getId();
        User author = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        CommentDTO commentDto = commentService.createComment(dto, author, post);
        return ResponseEntity.ok(commentDto);
    }
}