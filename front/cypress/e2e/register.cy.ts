describe('Inscription', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    cy.visit('http://localhost:4200/register');
  });

  it('affiche le formulaire', () => {
    cy.contains("Inscription");
    cy.get('input[formcontrolname="username"]').should('exist');
    cy.get('input[formcontrolname="email"]').should('exist');
    cy.get('input[formcontrolname="password"], input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('affiche une erreur si le formulaire est vide', () => {
    cy.get('input[formcontrolname="username"]').focus().blur();
    cy.contains("Nom d'utilisateur requis.").should('exist');
    cy.get('input[formcontrolname="email"]').focus().blur();
    cy.contains("L'email est requis.").should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('affiche une erreur si l\'email est invalide', () => {
    cy.get('input[formcontrolname="email"]').type('notanemail').blur();
    cy.contains("Le format de l'email est invalide.").should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('affiche une erreur si le mot de passe est trop court', () => {
    cy.get('input[formcontrolname="password"], input[type="password"]').type('abc');
    cy.get('h2').click();
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('inscrit un nouvel utilisateur', () => {
    cy.get('input[formcontrolname="username"]').type('testuser' + Date.now());
    cy.get('input[formcontrolname="email"]').type('test' + Date.now() + '@test.com');
    cy.get('input[formcontrolname="password"], input[type="password"]').type('Test1234!');
    cy.get('h2').click();
    cy.get('button[type="submit"]').click();
    cy.contains('Inscription réussie').should('exist');
    cy.url({ timeout: 10000 }).should('include', '/post');
  });

  it('affiche une erreur si l\'email est déjà utilisé', () => {
    // Crée l'utilisateur existant directement en base via l'API
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'userexistant',
      email: 'existant@test.com',
      password: 'Test1234!'
    });

    // Puis tente de s'inscrire avec le même email
    cy.get('input[formcontrolname="username"]').type('userexistant');
    cy.get('input[formcontrolname="email"]').type('existant@test.com');
    cy.get('input[formcontrolname="password"], input[type="password"]').type('Test1234!');
    cy.get('h2').click();
    cy.get('button[type="submit"]').click();
    cy.contains('Email déjà utilisé').should('exist');
  });

  it('n\'actionne pas le bouton submit si le mot de passe n\'est pas correct', () => {
    cy.get('input[formcontrolname="username"]').type('userbadpass');
    cy.get('input[formcontrolname="email"]').type('badpass' + Date.now() + '@test.com');
    cy.get('input[formcontrolname="password"], input[type="password"]').type('abcdefg');
    cy.get('h2').click();
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('redirige vers /post si déjà connecté', () => {
    // Crée d'abord l'utilisateur qui va se connecter
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'userconnecte',
      email: 'userconnecte@test.com',
      password: 'Test1234!'
    });
    
    // Se connecte avec cet utilisateur
    cy.request('POST', 'http://localhost:8080/api/auth/login', {
      emailOrUsername: 'userconnecte@test.com',
      password: 'Test1234!'
    });
    
    // Puis essaie d'accéder à la page d'inscription
    cy.visit('http://localhost:4200/register');
    cy.url({ timeout: 5000 }).should('include', '/post');
  });
});