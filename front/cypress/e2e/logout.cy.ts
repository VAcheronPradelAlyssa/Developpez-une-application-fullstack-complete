describe('Déconnexion (logout)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
  });

  it('déconnecte un utilisateur connecté et redirige vers /login', () => {
    // Inscription + connexion
    const username = 'logoutuser' + Date.now();
    const email = 'logout' + Date.now() + '@test.com';
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username,
      email,
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type(email);
    cy.get('input[formcontrolname="password"], input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');

    // Aller sur la page de logout
    cy.visit('http://localhost:4200/logout');
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.contains('Se connecter');
  });

  it('supprime le cookie de session après logout', () => {
    // Inscription + connexion
    const username = 'logoutcookie' + Date.now();
    const email = 'logoutcookie' + Date.now() + '@test.com';
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username,
      email,
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type(email);
    cy.get('input[formcontrolname="password"], input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');

    // Aller sur logout
    cy.visit('http://localhost:4200/logout');
    cy.url({ timeout: 10000 }).should('include', '/login');

    // Vérifie que le cookie a disparu côté navigateur
    cy.getCookie('token').should('not.exist');
  });

  it('redirige vers \'\' même si non connecté', () => {
    cy.visit('http://localhost:4200/logout');
    cy.url({ timeout: 10000 }).should('include', '');
    cy.contains('Se connecter');
  });

  it('redirige vers \'\' même avec un token invalide', () => {
    // Met un cookie token invalide
    cy.setCookie('token', 'invalidtoken');
    cy.visit('http://localhost:4200/logout');
    cy.url({ timeout: 10000 }).should('include', '');
    cy.contains('Se connecter');});

  it('l’API /api/auth/logout retourne un message de succès', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/logout').then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('message');
    });
  });
});
