describe('Gestion des thèmes (subject)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'subjectuser',
      email: 'subjectuser@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('subjectuser@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    // Crée quelques sujets pour les tests
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'Sujet1',
      description: 'Description 1'
    });
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'Sujet2',
      description: 'Description 2'
    });
    cy.visit('http://localhost:4200/subject');
  });

  it('affiche la liste des thèmes', () => {
    cy.contains('Sujet1');
    cy.contains('Sujet2');
    cy.contains('Description 1');
    cy.contains('Description 2');
  });

  it('permet de s\'abonner à un thème', () => {
    cy.contains('Sujet1').parents('app-card').within(() => {
      cy.get('button').contains("S'abonner").click();
      cy.contains('Déjà abonné').should('exist');
    });
    // Vérifie que le bouton est désactivé après abonnement
    cy.contains('Sujet1').parents('app-card').within(() => {
      cy.get('button.btn-subscribed').should('exist');
    });
  });

  it('permet de se désabonner d\'un thème', () => {
    // S'abonne d'abord
    cy.contains('Sujet2').parents('app-card').within(() => {
      cy.get('button').contains("S'abonner").click();
      cy.contains('Déjà abonné').should('exist');
    });
    // Se désabonne directement sur la page /subject
    cy.contains('Sujet2').parents('app-card').within(() => {
      cy.get('button.btn-subscribed').should('exist').click();
    });
    // Le bouton doit redevenir "S'abonner"
    cy.contains('Sujet2').parents('app-card').within(() => {
      cy.get('button').contains("S'abonner").should('exist');
    });
  });

  it('affiche "Déjà abonné" si déjà abonné', () => {
    cy.contains('Sujet1').parents('app-card').within(() => {
      cy.get('button').contains("S'abonner").click();
      cy.contains('Déjà abonné').should('exist');
    });
    // Recharge la page pour vérifier la persistance
    cy.reload();
    cy.contains('Sujet1').parents('app-card').within(() => {
      cy.contains('Déjà abonné').should('exist');
    });
  });

  it('affiche un message si aucun thème', () => {
    // Réinitialise la base sans créer de sujet
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'subjectuser2',
      email: 'subjectuser2@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('subjectuser2@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.visit('http://localhost:4200/subject');
    cy.get('.card-grid app-card').should('have.length', 0);
    cy.contains('Aucun thème').should('exist'); // selon ton affichage
  });

  it('refuse l\'accès à la page si non connecté', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.visit('http://localhost:4200/subject');
    cy.url().should('not.include', '/subject');
  });
});

