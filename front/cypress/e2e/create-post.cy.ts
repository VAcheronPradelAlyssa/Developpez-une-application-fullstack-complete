describe('Création d\'article', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    // Crée un utilisateur et connecte-le
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'posteur',
      email: 'posteur@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('posteur@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    // Crée un thème pour les tests
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'CypressTest',
      description: 'Sujet pour les tests Cypress'
    });
    cy.visit('http://localhost:4200/create-post');
  });

  it('affiche le formulaire de création', () => {
    cy.contains('Créer un nouvel article');
    cy.get('input[formcontrolname="subjectName"]').should('exist');
    cy.get('input[formcontrolname="title"]').should('exist');
    cy.get('textarea[formcontrolname="content"]').should('exist');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('désactive le bouton si le formulaire est incomplet', () => {
    cy.get('input[formcontrolname="title"]').type('Mon article');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[formcontrolname="subjectName"]').type('CypressTest');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('textarea[formcontrolname="content"]').type('Contenu');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('affiche les suggestions de thèmes', () => {
    cy.get('input[formcontrolname="subjectName"]').type('Cyp');
    // Attend que les options d'autocomplete apparaissent
    cy.get('mat-option').should('exist');
    cy.contains('CypressTest').should('exist');
    cy.get('mat-option').first().click();
    cy.get('input[formcontrolname="subjectName"]').should('have.value', 'CypressTest');
  });

  it('crée un nouvel article', () => {
    cy.get('input[formcontrolname="subjectName"]').type('CypressTest');
    cy.get('mat-option').first().click();
    cy.get('input[formcontrolname="title"]').type('Titre Cypress');
    cy.get('textarea[formcontrolname="content"]').type('Contenu de test');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.contains('Titre Cypress');
    cy.contains('Contenu de test');
  });

  it('affiche une erreur si le thème n\'existe pas', () => {
    cy.get('input[formcontrolname="subjectName"]').type('Inexistant');
    cy.get('input[formcontrolname="title"]').type('Titre');
    cy.get('textarea[formcontrolname="content"]').type('Contenu');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Veuillez sélectionner un thème valide');
    });
  });

  it('bouton retour ramène à la liste des posts', () => {
    cy.get('app-bouton-retour button').click();
    cy.url().should('include', '/post');
  });

  it('refuse l\'accès à la page si non connecté', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.visit('http://localhost:4200/create-post');
    cy.url().should('not.include', '/create-post');
    // Vérifie qu'on est redirigé vers l'accueil ou login
    cy.url().should('match', /\/(login|)$/);
  });

  it('permet l\'accès si connecté', () => {
    // Déjà connecté via beforeEach
    cy.visit('http://localhost:4200/create-post');
    cy.url().should('include', '/create-post');
    cy.contains('Créer un nouvel article').should('exist');
  });
});
