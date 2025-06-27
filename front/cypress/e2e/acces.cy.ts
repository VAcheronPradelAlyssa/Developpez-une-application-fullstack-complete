describe('Tests d\'accès', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
  });

  it('accès aux pages login et register sans être connecté', () => {
    cy.visit('http://localhost:4200/login');
    cy.contains('Se connecter');
    cy.visit('http://localhost:4200/register');
    cy.contains('Inscription');
  });

  it('refuse l\'accès aux pages privées sans connexion', () => {
    cy.visit('http://localhost:4200/post');
    cy.url().should('include', '');
    cy.visit('http://localhost:4200/profile');
    cy.url().should('include', '');
    cy.visit('http://localhost:4200/subject');
    cy.url().should('include', '');
    cy.visit('http://localhost:4200/subject/create');
    cy.url().should('include', '');
  });

  it('autorise l\'accès aux pages privées après connexion', () => {
    // Inscription + connexion
    const username = 'accesuser' + Date.now();
    const email = 'acces' + Date.now() + '@test.com';
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username,
      email,
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type(email);
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.visit('http://localhost:4200/user-profile');
    cy.url().should('include', '/user-profile');
    cy.visit('http://localhost:4200/subject');
    cy.url().should('include', '/subject');
    cy.visit('http://localhost:4200/post');
    cy.url().should('include', '/post');
    cy.visit('http://localhost:4200/create-post');
    cy.url().should('include', '/create-post');
  });

  it('redirige vers /post si déjà connecté et visite /login ou /register', () => {
    // Inscription + connexion
    const username = 'rediruser' + Date.now();
    const email = 'redir' + Date.now() + '@test.com';
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username,
      email,
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type(email);
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    
    // Test redirection depuis /login
    cy.visit('http://localhost:4200/login');
    cy.url({ timeout: 5000 }).should('include', '/post');
    
    // Test redirection depuis /register  
    cy.visit('http://localhost:4200/register');
    cy.url({ timeout: 5000 }).should('include', '/post');
  });

  it('affiche le message "déjà connecté" sur les pages login et register', () => {
    // Inscription + connexion
    const username = 'alreadyuser' + Date.now();
    const email = 'already' + Date.now() + '@test.com';
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username,
      email,
      password: 'Test1234!'
    });
    
    // Connexion via l'API pour avoir le cookie
    cy.request('POST', 'http://localhost:8080/api/auth/login', {
      emailOrUsername: email,
      password: 'Test1234!'
    });
    
    // Visite la page de login et vérifie le message
    cy.visit('http://localhost:4200/login');
    cy.contains('Vous êtes déjà connecté').should('exist');
    
    // Visite la page d'inscription et vérifie le message
    cy.visit('http://localhost:4200/register');
    cy.contains('Vous êtes déjà connecté').should('exist');
  });

});
