import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post';
import { Post } from 'src/app/models/post.dto';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit récupérer tous les posts', () => {
    const mockPosts: Post[] = [{
      id: 1,
      title: 'Titre',
      content: 'Contenu',
      createdAt: '2024-06-24T10:00:00Z',
      authorId: 1,
      authorUsername: 'auteur',
      subjectId: 1,
      subjectName: 'Sujet'
    }];

    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Titre');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('doit récupérer un post par ID', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Titre',
      content: 'Contenu',
      createdAt: '2024-06-24T10:00:00Z',
      authorId: 1,
      authorUsername: 'auteur',
      subjectId: 1,
      subjectName: 'Sujet'
    };

    service.getPostById(1).subscribe(post => {
      expect(post.title).toBe('Titre');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/posts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('doit créer un post', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Nouveau',
      content: 'Contenu',
      createdAt: '2024-06-24T10:00:00Z',
      authorId: 1,
      authorUsername: 'auteur',
      subjectId: 1,
      subjectName: 'Sujet'
    };

    service.createPost({ title: 'Nouveau', content: 'Contenu', subjectId: 1 }).subscribe(post => {
      expect(post.title).toBe('Nouveau');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/posts');
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('doit récupérer les commentaires d\'un post', () => {
    const mockComments = [
      { id: 1, content: 'Commentaire', author: { username: 'user' } }
    ];
    
    service.getComments(1).subscribe(comments => {
      expect(comments.length).toBe(1);
      expect(comments[0].content).toBe('Commentaire');
    });
    
    const req = httpMock.expectOne('http://localhost:8080/api/posts/1/comments');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockComments);
  });

  it('doit ajouter un commentaire à un article', () => {
    const comment = { content: 'Nouveau commentaire' };
    const mockResp = { id: 1, content: 'Nouveau commentaire' };
    
    service.addComment(1, comment).subscribe((resp: any) => {
      expect(resp).toEqual(mockResp);
    });
    
    const req = httpMock.expectOne('http://localhost:8080/api/posts/1/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(comment);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResp);
  });
});
