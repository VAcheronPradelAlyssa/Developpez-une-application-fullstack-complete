package com.openclassrooms.mddapi.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "MDD API - Monde de Dév",
        version = "1.0.0",
        description = """
            ## API REST pour la plateforme de développeurs MDD
            
            Cette API fournit tous les endpoints nécessaires pour :
            - 🔐 **Authentification** : Inscription, connexion, déconnexion
            - 👤 **Gestion des utilisateurs** : Profils, mise à jour
            - 📝 **Articles** : Création, lecture, liste
            - 💬 **Commentaires** : Ajout et consultation
            - 🏷️ **Sujets** : Gestion et abonnements
            
            ### Authentification
            L'API utilise des **tokens JWT** stockés dans des cookies HttpOnly sécurisés.
            
            ### Workflow d'utilisation
            1. S'inscrire via `/api/auth/register` ou se connecter via `/api/auth/login`
            2. Le token JWT est automatiquement géré via les cookies
            3. Accéder aux endpoints protégés (tous sauf `/api/auth/*`)
            4. Se déconnecter via `/api/auth/logout`
            """,
        contact = @Contact(
            name = "Équipe MDD",
            url = "http://localhost:4200"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080",
            description = "🔧 Serveur de développement"
        ),
       
    }
)
@SecurityScheme(
    name = "cookieAuth",
    type = SecuritySchemeType.APIKEY,
    in = io.swagger.v3.oas.annotations.enums.SecuritySchemeIn.COOKIE,
    paramName = "token",
    description = """
        🍪 **Authentification par Cookie JWT**
        
        Le token JWT est automatiquement géré via un cookie HttpOnly sécurisé.
        
        **Comment l'utiliser :**
        1. Connectez-vous via `/api/auth/login`
        2. Le cookie sera automatiquement défini
        3. Tous les appels suivants incluront automatiquement le token
        
        **Note :** Dans Swagger UI, vous devrez vous connecter via l'endpoint de login
        pour que le cookie soit défini dans votre navigateur.
        """
)
public class OpenApiConfig {
    // Configuration automatique via les annotations
}
