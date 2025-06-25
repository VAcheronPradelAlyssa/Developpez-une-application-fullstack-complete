# Frontend MDD - Monde de Dév

## 📋 Description

Frontend de l'application MDD développé avec Angular 20.0.0. Cette application SPA (Single Page Application) offre une interface utilisateur moderne et responsive pour la plateforme de développeurs.

## 🛠️ Technologies

- **Angular 20.0.0** - Framework principal
- **Angular Material 20.0.1** - Composants UI
- **TypeScript 5.8.3** - Langage de programmation
- **RxJS 7.8.2** - Programmation réactive
- **Angular CDK** - Kit de développement de composants

## 🏗️ Architecture

```
src/
├── app/
│   ├── components/      # Composants réutilisables
│   ├── guards/          # Guards de navigation
│   ├── models/          # Interfaces et modèles TypeScript
│   ├── navbar/          # Composant de navigation
│   ├── pages/           # Pages de l'application
│   ├── services/        # Services Angular
│   └── shared/          # Composants partagés
├── assets/              # Images, icônes, etc.
├── environments/        # Configuration d'environnement
└── styles/              # Styles globaux
```

## 🚀 Installation

### Prérequis

- **Node.js 18** ou supérieur
- **npm** ou **yarn**
- **Angular CLI 20.0+**

```bash
npm install -g @angular/cli@20.0.1
```

### Installation des dépendances

```bash
npm install
```

## 🎯 Scripts disponibles

### Développement

```bash
# Démarrer le serveur de développement
npm start
# ou
ng serve

# Démarrer avec le backend automatiquement
npm run start:all

# Démarrer uniquement le frontend
npm run start:front
```

L'application sera accessible sur http://localhost:4200

### Build

```bash
# Build de production
npm run build
# ou
ng build

# Build en mode watch
npm run watch
```

Les fichiers de build seront générés dans le dossier `dist/`.

### Tests

```bash
# Tests unitaires
npm test
# ou
ng test

# Tests unitaires en mode watch
ng test --watch=true

# Tests avec coverage
ng test --code-coverage
```

### Tests End-to-End

```bash
# Ouvrir Cypress
npm run cypress:open

# Exécuter les tests E2E
npm run cypress:run

# Tests E2E complets (Backend + Frontend + Tests)
npm run test:e2e:all
```

## 🔧 Configuration

### Environnements

Deux environnements sont configurés :

- **Development** : `src/environments/environment.ts`
- **Production** : `src/environments/environment.prod.ts`

### Proxy de développement

Le fichier `proxy.config.json` redirige les appels API vers le backend :

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": true,
    "changeOrigin": true
  }
}
```

## 🎨 Composants principaux

### Pages
- **Home** - Page d'accueil
- **Login** - Connexion utilisateur
- **Register** - Inscription utilisateur
- **Posts** - Liste des articles
- **Post Detail** - Détail d'un article
- **Create Post** - Création d'article
- **Profile** - Profil utilisateur
- **Subjects** - Gestion des sujets

### Services
- **AuthService** - Gestion de l'authentification
- **PostService** - Gestion des articles
- **UserService** - Gestion des utilisateurs
- **SubjectService** - Gestion des sujets
- **CommentService** - Gestion des commentaires

### Guards
- **AuthGuard** - Protection des routes authentifiées
- **NoAuthGuard** - Redirection si déjà connecté

## 🔒 Sécurité

- **JWT Tokens** : Stockage sécurisé dans localStorage
- **Guards** : Protection des routes
- **Interceptors** : Ajout automatique des tokens aux requêtes
- **Validation** : Validation côté client avec Angular Forms

## 📱 Responsive Design

L'application est entièrement responsive grâce à :
- **Angular Flex Layout**
- **Angular Material** 
- **CSS Grid et Flexbox**
- **Breakpoints Material Design**

## 🧪 Tests

### Structure des tests

```
src/
├── app/
│   ├── component.spec.ts     # Tests unitaires des composants
│   ├── service.spec.ts       # Tests unitaires des services
│   └── guard.spec.ts         # Tests unitaires des guards
└── cypress/
    ├── e2e/                  # Tests end-to-end
    ├── fixtures/             # Données de test
    └── support/              # Utilitaires de test
```

### Coverage

Les rapports de coverage sont générés dans `coverage/` après avoir exécuté :

```bash
ng test --code-coverage
```

## 🚀 Déploiement

### Build de production

```bash
ng build --configuration production
```

### Variables d'environnement de production

Configurez les variables dans `src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## 📦 Dépendances principales

### Dépendances de production
- `@angular/core` - Framework Angular
- `@angular/material` - Composants Material Design
- `@angular/cdk` - Component Development Kit
- `@angular/forms` - Gestion des formulaires
- `@angular/router` - Routage
- `rxjs` - Programmation réactive

### Dépendances de développement
- `@angular/cli` - Outils de développement
- `typescript` - Langage TypeScript
- `cypress` - Tests end-to-end
- `karma` - Runner de tests unitaires
- `jasmine` - Framework de tests

##  Debugging

### Outils de développement

- **Angular DevTools** - Extension Chrome/Firefox
- **Redux DevTools** - Si utilisation de NgRx
- **Console du navigateur** - Logs et erreurs

### Logs

Utilisation du service de logging personnalisé pour un debugging efficace.

## 📚 Ressources

- [Documentation Angular](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
