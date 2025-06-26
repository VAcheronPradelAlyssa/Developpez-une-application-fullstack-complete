# MDD - Monde de Dév

## 📋 Description

**MDD** (Monde de Dév) est une application full-stack moderne conçue pour créer une communauté de développeurs. L'application permet aux utilisateurs de s'inscrire, de se connecter, de publier des articles, de commenter et de s'abonner à différents sujets technologiques.

### 🛠️ Technologies utilisées

**Frontend :**
- Angular 20.0.0
- Angular Material pour l'interface utilisateur
- TypeScript
- RxJS pour la programmation réactive
- Cypress pour les tests end-to-end

**Backend :**
- Spring Boot 3.3.0
- Java 21
- Spring Security avec JWT
- Spring Data JPA
- MySQL 8.0
- Maven pour la gestion des dépendances

## 🏗️ Architecture du projet

```
├── back/           # API REST Spring Boot
├── front/          # Application Angular
└── resources/      # Ressources et documentation
```

## 🚀 Installation et démarrage

### Prérequis

- **Java 21** ou supérieur
- **Node.js 18** ou supérieur
- **MySQL 8.0**
- **Maven 3.9+**
- **Angular CLI 20.0+**

### Configuration de la base de données

1. Créez une base de données MySQL nommée `mdd`
2. Modifiez les paramètres de connexion dans `back/src/main/resources/application.properties`

### Démarrage rapide

1. **Clonez le projet**
```bash
git clone <repository-url>
cd Developpez-une-application-full-stack-complete
```

2. **Démarrage automatique (Frontend + Backend)**
```bash
cd front
npm install
npm run start:all
```

3. **Ou démarrage manuel :**

**Backend :**
```bash
cd back
mvn spring-boot:run
```

**Frontend :**
```bash
cd front
npm install
npm start
```

4. **Accédez à l'application :**
   - Frontend : http://localhost:4200
   - Backend API : http://localhost:8080

## 🧪 Tests

### Tests Backend
```bash
cd back
mvn test
```

### Tests Frontend
```bash
cd front
npm test
```

### Tests End-to-End
```bash
cd front
npm run test:e2e:all
```

## 📚 Documentation

- [Documentation Backend](./back/README.md)
- [Documentation Frontend](./front/README.md)

## 🔒 Sécurité

L'application utilise JWT (JSON Web Tokens) pour l'authentification et l'autorisation. Les tokens sont valides pendant 24 heures.

## 🎨 Interface utilisateur

L'application utilise Angular Material pour une interface moderne et responsive. Les écrans disponibles incluent :

- Page d'accueil
- Connexion/Inscription
- Liste des articles
- Création d'articles
- Profil utilisateur
- Gestion des abonnements aux sujets

## 📝 Fonctionnalités

- ✅ Authentification et autorisation
- ✅ Gestion des utilisateurs
- ✅ Publication et lecture d'articles
- ✅ Système de commentaires
- ✅ Abonnement à des sujets
- ✅ Interface responsive
- ✅ Tests automatisés

# Choix Technologiques - Analyse Comparative

Chaque technologie a été retenue après une analyse comparative :

**Angular**, imposé par l'entreprise, est parfaitement adapté à notre besoin de SPA d'entreprise, avec une intégration totale de **RxJS** et **Angular Material**.

**Spring Boot** et ses modules permettent un développement rapide, sécurisé, et une gestion efficace des utilisateurs/rôles avec **Spring Security**.

**BCrypt** est le standard pour le hashage des mots de passe côté Spring.

**RxJS** facilite la gestion des flux de données asynchrones.

**Angular Material** permet de respecter les maquettes et d'assurer l'accessibilité.

**Lombok** réduit considérablement le code Java répétitif.

**Cypress** assure la robustesse de la chaîne de tests end-to-end.

**GitHub** est le standard universel du versioning et de la collaboration en entreprise.

## Stack Technique Finale

### Frontend
- Angular 20.0 + TypeScript 5.8
- RxJS 7.8 pour la programmation réactive
- Angular Material 20.0 pour l'UI/UX
- Jasmine + Zone.js pour les tests unitaires

### Backend  
- Spring Boot 3.x + Java 21
- Spring Security + JWT + BCrypt
- Spring Data JPA + MySQL
- Lombok pour la réduction du boilerplate

### Tests & Outils
- Cypress 14.5 pour les tests E2E
- Maven pour le build Java
- GitHub pour le versioning



