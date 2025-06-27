describe('Profil utilisateur', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'profiluser',
      email: 'profiluser@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('profiluser@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    cy.visit('http://localhost:4200/user-profile');
  });

  it('affiche le formulaire de profil', () => {
    cy.contains('Profil utilisateur');
    cy.get('input[name="username"]').should('have.value', 'profiluser');
    cy.get('input[name="email"]').should('have.value', 'profiluser@test.com');
    cy.get('button[type="submit"]').should('exist');
  });

  it('modifie et sauvegarde le profil', () => {
    cy.get('input[name="username"]').clear().type('profilmodif');
    cy.get('input[name="email"]').clear().type('profilmodif@test.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Profil mis à jour !').should('exist');
    cy.reload();
    cy.get('input[name="username"]').should('have.value', 'profilmodif');
    cy.get('input[name="email"]').should('have.value', 'profilmodif@test.com');
  });

  it('modifie et sauvegarde le mot de passe', () => {
    cy.get('input[name="password"]').type('NouveauPass123!');
    cy.get('button[type="submit"]').click();
    cy.contains('Profil mis à jour !').should('exist');
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('profiluser@test.com');
    cy.get('input[type="password"]').type('NouveauPass123!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
  });

  it('affiche une erreur si le backend échoue', () => {
    cy.intercept('PUT', '/api/user/profile', { statusCode: 500 }).as('updateProfile');
    cy.get('input[name="username"]').clear().type('failuser');
    cy.get('button[type="submit"]').click();
    cy.contains('Erreur lors de la mise à jour.').should('exist');
  });

  it('affiche les abonnements', () => {
    // Crée un sujet via l'API
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetProfil',
      description: 'Sujet pour profil'
    }).then(() => {
      // Va sur la page des sujets et s'abonne via l'UI
      cy.visit('http://localhost:4200/subject');
      // Attendre que la page charge et utiliser le bon sélecteur
      cy.contains('SujetProfil').should('be.visible');
      cy.contains('SujetProfil').parents('app-card').within(() => {
        cy.get('button').contains("S'abonner").click();
      });
      // Va sur le profil et vérifie l'abonnement
      cy.visit('http://localhost:4200/user-profile');
      cy.contains('SujetProfil').should('exist');
      cy.contains('Se désabonner').should('exist');
    });
  });

  it('désabonne l\'utilisateur d\'un sujet', () => {
    // Crée un sujet via l'API
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetDesabonnement',
      description: 'Sujet à désabonner'
    }).then(() => {
      // Va sur la page des sujets et s'abonne via l'UI
      cy.visit('http://localhost:4200/subject');
      cy.contains('SujetDesabonnement').should('be.visible');
      cy.contains('SujetDesabonnement').parents('app-card').within(() => {
        cy.get('button').contains("S'abonner").click();
      });
      // Va sur le profil et se désabonne via l'UI
      cy.visit('http://localhost:4200/user-profile');
      cy.contains('SujetDesabonnement').should('exist');
      cy.contains('SujetDesabonnement').parents('app-card').within(() => {
        cy.get('button').contains('Se désabonner').click();
      });
      cy.contains('SujetDesabonnement').should('not.exist');
    });
  });

  it('affiche "Aucun abonnement trouvé" si aucun abonnement', () => {
    cy.get('.subscriptions-list').should('not.exist');
    cy.contains('Aucun abonnement trouvé.').should('exist');
  });

  it('refuse l\'accès à la page si non connecté', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.visit('http://localhost:4200/user-profile');
    cy.url().should('not.include', '/user-profile');
  });
});
