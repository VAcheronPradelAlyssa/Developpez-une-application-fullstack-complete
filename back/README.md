# Backend MDD - Monde de Dév

## 📋 Description

API REST développée avec Spring Boot pour l'application MDD. Cette API fournit tous les services backend nécessaires pour la gestion des utilisateurs, articles, commentaires et sujets de la plateforme de développeurs.

## 🛠️ Technologies

- **Spring Boot 3.3.0** - Framework principal
- **Java 21** - Langage de programmation
- **Spring Security** - Sécurité et authentification
- **Spring Data JPA** - Accès aux données
- **MySQL 8.0** - Base de données
- **JWT** - Authentification par tokens
- **Maven** - Gestionnaire de dépendances
- **Lombok** - Réduction du code boilerplate
- **MapStruct** - Mapping d'objets

## 🏗️ Architecture

```
src/main/java/com/openclassrooms/mddapi/
├── config/          # Configuration Spring
├── controller/      # Contrôleurs REST
├── dto/            # Data Transfer Objects
├── exception/      # Gestion des exceptions
├── mapper/         # Mappers MapStruct
├── model/          # Entités JPA
├── repository/     # Repositories Spring Data
├── security/       # Configuration sécurité
├── service/        # Services métier
├── util/           # Utilitaires
└── validation/     # Validations personnalisées
```

## 🚀 Installation

### Prérequis

- **Java 21** ou supérieur
- **Maven 3.9+**
- **MySQL 8.0**

### Configuration de la base de données

1. **Créer la base de données :**
```sql
CREATE DATABASE mdd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'Admin#2025';
GRANT ALL PRIVILEGES ON mdd.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

2. **Configuration dans `application.properties` :**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mdd
spring.datasource.username=admin
spring.datasource.password=Admin#2025
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
jwt.secret=g9ceEZhZutaqL0Tqo5i2FXfEVFirpLLKOZwcvJXQjUI=
jwt.expiration=86400000
```

### Installation des dépendances

```bash
mvn clean install
```

## 🎯 Démarrage

### Mode développement

```bash
mvn spring-boot:run
```

### Mode test

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

L'API sera accessible sur http://localhost:8080

## 📡 API Endpoints

### Authentification

```http
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
GET  /api/auth/me          # Informations utilisateur connecté
```

### Utilisateurs

```http
GET    /api/users/{id}      # Récupérer un utilisateur
PUT    /api/users/{id}      # Modifier un utilisateur
GET    /api/users/me        # Profil utilisateur connecté
PUT    /api/users/me        # Modifier son profil
```

### Articles (Posts)

```http
GET    /api/posts           # Lister tous les articles
GET    /api/posts/{id}      # Récupérer un article
POST   /api/posts           # Créer un article
PUT    /api/posts/{id}      # Modifier un article
DELETE /api/posts/{id}      # Supprimer un article
```

### Commentaires

```http
GET    /api/posts/{postId}/comments     # Commentaires d'un article
POST   /api/posts/{postId}/comments     # Ajouter un commentaire
PUT    /api/comments/{id}               # Modifier un commentaire
DELETE /api/comments/{id}               # Supprimer un commentaire
```

### Sujets

```http
GET    /api/subjects           # Lister tous les sujets
GET    /api/subjects/{id}      # Récupérer un sujet
POST   /api/subjects           # Créer un sujet
PUT    /api/subjects/{id}      # Modifier un sujet
DELETE /api/subjects/{id}      # Supprimer un sujet
```

### Abonnements

```http
GET    /api/users/me/subscriptions    # Mes abonnements
POST   /api/subjects/{id}/subscribe   # S'abonner à un sujet
DELETE /api/subjects/{id}/unsubscribe # Se désabonner d'un sujet
```

## 🗄️ Modèle de données

### Entités principales

#### User
- `id` (Long) - Identifiant unique
- `email` (String) - Email unique
- `username` (String) - Nom d'utilisateur unique
- `password` (String) - Mot de passe hashé
- `createdAt` (Date) - Date de création
- `updatedAt` (Date) - Date de mise à jour

#### Post
- `id` (Long) - Identifiant unique
- `title` (String) - Titre de l'article
- `content` (Text) - Contenu de l'article
- `author` (User) - Auteur de l'article
- `subject` (Subject) - Sujet associé
- `createdAt` (Date) - Date de création

#### Comment
- `id` (Long) - Identifiant unique
- `content` (Text) - Contenu du commentaire
- `author` (User) - Auteur du commentaire
- `post` (Post) - Article commenté
- `createdAt` (Date) - Date de création

#### Subject
- `id` (Long) - Identifiant unique
- `name` (String) - Nom du sujet
- `description` (Text) - Description du sujet
- `createdAt` (Date) - Date de création

## 🔒 Sécurité

### JWT (JSON Web Tokens)

- **Secret** : Clé secrète configurée dans `application.properties`
- **Expiration** : 24 heures (86400000 ms)
- **Claims** : userId, username, email

### Configuration Spring Security

```java
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    // Configuration CORS
    // Configuration JWT
    // Protection des endpoints
}
```

### Endpoints protégés

- Tous les endpoints `/api/**` sauf `/api/auth/**`
- Authentification par JWT Bearer Token
- Validation des rôles et permissions

## 🧪 Tests

### Structure des tests

```
src/test/java/com/openclassrooms/mddapi/
├── controller/      # Tests des contrôleurs
├── repository/      # Tests des repositories
├── service/         # Tests des services
└── security/        # Tests de sécurité
```

### Exécution des tests

```bash
# Tous les tests
mvn test

# Tests spécifiques
mvn test -Dtest=UserControllerTest
mvn test -Dtest=*Service*

# Tests avec coverage
mvn test jacoco:report
```

### Configuration des tests

- **Base de données** : H2 en mémoire
- **Profil test** : `application-test.properties`
- **Mock** : Mockito pour les tests unitaires
- **TestContainers** : Pour les tests d'intégration

## 📦 Dépendances principales

### Core Spring Boot
- `spring-boot-starter-web` - Web MVC
- `spring-boot-starter-data-jpa` - JPA/Hibernate
- `spring-boot-starter-security` - Sécurité
- `spring-boot-starter-validation` - Validation

### Base de données
- `mysql-connector-j` - Driver MySQL
- `h2` - Base de données de test

### Sécurité
- `jjwt-api` - JWT API
- `jjwt-impl` - JWT Implementation
- `jjwt-jackson` - JWT Jackson

### Utilitaires
- `lombok` - Réduction du code boilerplate
- `mapstruct` - Mapping d'objets

### Tests
- `spring-boot-starter-test` - Tests Spring Boot
- `spring-security-test` - Tests de sécurité

## 🔧 Configuration

### Profils Spring

#### Développement (défaut)
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.org.springframework.security=DEBUG
```

#### Test
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
```

#### Production
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.org.springframework.security=WARN
```

## 🚀 Déploiement

### Build de production

```bash
mvn clean package -DskipTests
```

### Variables d'environnement

```bash
export DB_URL=jdbc:mysql://prod-server:3306/mdd
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password
export JWT_SECRET=your-production-secret-key
export JWT_EXPIRATION=86400000
```


## 📊 Monitoring et Logs

### Actuator endpoints

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

### Logging

```properties
logging.level.com.openclassrooms.mddapi=INFO
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.file.name=logs/mdd-api.log
```

##  Debugging

### Logs utiles

```properties
# SQL Queries
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Security
logging.level.org.springframework.security=DEBUG

# Custom
logging.level.com.openclassrooms.mddapi=DEBUG
```

### Profiling

Utiliser Spring Boot Actuator pour le monitoring en temps réel des performances.

