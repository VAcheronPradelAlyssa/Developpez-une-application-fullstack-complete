describe('Détail d\'article', () => {
  let postId: number;

  beforeEach(() => {
    cy.request('POST', 'http://localhost:8080/api/test/reset-db');
    // Crée un utilisateur et connecte-le
    cy.request('POST', 'http://localhost:8080/api/auth/register', {
      username: 'detailuser',
      email: 'detailuser@test.com',
      password: 'Test1234!'
    });
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="emailOrUsername"]').type('detailuser@test.com');
    cy.get('input[type="password"]').type('Test1234!');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/post');
    // Crée un thème
    cy.request('POST', 'http://localhost:8080/api/subjects', {
      name: 'SujetDetail',
      description: 'Sujet pour test détail'
    }).then((resp) => {
      const subjectId = resp.body.id || 1;
      // Crée un post
      cy.request('POST', 'http://localhost:8080/api/posts', {
        title: 'Titre détail',
        content: 'Contenu de l\'article détail',
        subjectId
      }).then((resp2) => {
        postId = resp2.body.id;
        // Ajoute un commentaire
        cy.request('POST', `http://localhost:8080/api/posts/${postId}/comments`, {
          content: 'Premier commentaire'
        });
      });
    });
  });

  it('affiche le détail de l\'article', () => {
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.get('h1.article-title').should('contain', 'Titre détail');
    cy.get('.meta-list').within(() => {
      cy.get('span').eq(0).should('contain', 'Date:');
      cy.get('span').eq(1).should('contain', 'Auteur: detailuser');
      cy.get('span').eq(2).should('contain', 'Thème: SujetDetail');
    });
    cy.get('.article-content').should('contain', 'Contenu de l\'article détail');
  });

  it('affiche les commentaires', () => {
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.contains('Premier commentaire');
  });

  it('ajoute un commentaire', () => {
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.get('textarea[name="newComment"]').type('Nouveau commentaire');
    cy.get('button[type="submit"]').click();
    cy.contains('Nouveau commentaire');
  });

  it('désactive le bouton si le commentaire est vide', () => {
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.get('textarea[name="newComment"]').clear();
    // Vérifie que le bouton est désactivé quand le textarea est vide
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Optionnel : vérifie qu'il se réactive quand on tape quelque chose
    cy.get('textarea[name="newComment"]').type('Nouveau commentaire');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('le bouton retour ramène à la liste des articles', () => {
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.get('app-bouton-retour button').click();
    cy.url().should('include', '/post');
  });

  it('refuse l\'accès à la page si non connecté', () => {
    cy.request('POST', 'http://localhost:8080/api/auth/logout');
    cy.visit(`http://localhost:4200/post/${postId}`);
    cy.url().should('not.include', `/post/${postId}`);
  });
});

