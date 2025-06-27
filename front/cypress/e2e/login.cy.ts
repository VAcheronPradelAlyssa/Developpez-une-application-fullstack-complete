describe('Connexion', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    // Déconnexion pour s'assurer qu'aucun utilisateur n'est connecté
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
  });

  it('affiche le formulaire de connexion', () => {
    cy.contains('Se connecter');
    cy.get('input[formcontrolname="emailOrUsername"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('affiche une erreur si le formulaire est vide', () => {
    cy.get('input[formcontrolname="emailOrUsername"]').focus().blur();
    cy.contains("Email ou nom d'utilisateur requis").should('exist');
    cy.get('input[type="password"]').focus().blur();
    cy.contains("Mot de passe requis").should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });


 
  it('affiche une erreur si le mot de passe est incorrect', () => {
    cy.get('input[formcontrolname="emailOrUsername"]').type('testuser@test.com');
    cy.get('input[type="password"]').type('MauvaisMotDePasse');
    cy.get('button[type="submit"]').click();
    cy.contains('Identifiants invalides').should('exist');
  });

  it('connecte un utilisateur avec les bons identifiants email', () => {
    cy.get('input[formcontrolname="emailOrUsername"]').type('testuser@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.contains('Se déconnecter').should('exist');
  });

  it('connecte un utilisateur avec les bons identifiants username', () => {
    cy.get('input[formcontrolname="emailOrUsername"]').type('testuser');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.contains('Se déconnecter').should('exist');
  });

  it('redirige vers /post si déjà connecté', () => {
    // Se connecte d'abord
    cy.get('input[formcontrolname="emailOrUsername"]').type('testuser@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    
    // Puis essaie d'accéder à la page de login
    cy.visit('http://localhost:4200/login');
    cy.url({ timeout: 5000 }).should('include', '/post');
  });
});