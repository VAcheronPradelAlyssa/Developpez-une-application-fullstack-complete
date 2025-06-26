describe('Liste des articles (/post)', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'postlist',
      email: 'postlist@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('postlist@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
  });

  it('affiche un message si aucun article', () => {
    cy.get('.no-post').should('contain', 'Aucun article trouvé');
  });

  it('affiche la liste des articles', () => {
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetPost',
      description: 'Sujet pour test post'
    }).then((resp) => {
      const subjectId = resp.body.id || 1;
      cy.request('POST', 'http://localhost:8080/api/posts', {
        title: 'Premier article',
        content: 'Contenu premier',
        subjectId
      });
      cy.request('POST', 'http://localhost:8080/api/posts', {
        title: 'Deuxième article',
        content: 'Contenu deuxième',
        subjectId
      });
    });
    cy.visit('http://localhost:4200/post');
    cy.contains('Premier article');
    cy.contains('Deuxième article');
  });

  it('le bouton "Créer un article" redirige vers /create-post', () => {
    cy.get('button.btn-create').click();
    cy.url().should('include', '/create-post');
  });

  it('le tri fonctionne du plus récent au plus ancien', () => {
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetTri',
      description: 'Sujet pour tri'
    }).then((resp) => {
      const subjectId = resp.body.id || 1;
      cy.request('POST', 'http://localhost:8080/api/posts', {
        title: 'Ancien',
        content: 'Ancien contenu',
        subjectId
      }).then(() => {
        cy.wait(1000); // Pour garantir un timestamp différent
        cy.request('POST', 'http://localhost:8080/api/posts', {
          title: 'Récent',
          content: 'Récent contenu',
          subjectId
        }).then(() => {
          cy.visit('http://localhost:4200/post');
          cy.get('.card-grid app-card').should('have.length.at.least', 2);
          cy.get('.card-grid app-card').first().should('contain.text', 'Récent');
          cy.get('.sort-arrow').click();
          cy.get('.card-grid app-card').first().should('contain.text', 'Ancien');
        });
      });
    });
  });

  it('navigue vers le détail d\'un article au clic', () => {
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetNav',
      description: 'Sujet pour nav'
    }).then((resp) => {
      const subjectId = resp.body.id || 1;
      cy.request('POST', 'http://localhost:8080/api/posts', {
        title: 'ArticleNav',
        content: 'Contenu nav',
        subjectId
      }).then((resp2) => {
        const postId = resp2.body.id;
        cy.visit('http://localhost:4200/post');
        cy.contains('ArticleNav').click();
        cy.url().should('include', `/post/${postId}`);
      });
    });
  });

  it('affiche un message de chargement', () => {
    cy.visit('http://localhost:4200/post');
    cy.get('.loading-block').should('contain', 'Chargement');
  });

  it('affiche un message d\'erreur si l\'API échoue', () => {
    cy.intercept('GET', '/api/posts', { forceNetworkError: true }).as('getPostsError');
    cy.visit('http://localhost:4200/post');
    // ErrorInterceptor affiche maintenant les erreurs via SnackBar
    cy.get('.mat-mdc-snack-bar-container').should('contain', 'Une erreur est survenue');
  });
});


