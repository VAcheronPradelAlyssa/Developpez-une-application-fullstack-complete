import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Post, PostService } from './post';

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

  it('doit créer un article', () => {
    const payload = { title: 'Titre', content: 'Contenu', subjectId: 1 };
    const created: Post = {
      id: 1,
      title: 'Titre',
      content: 'Contenu',
      createdAt: '',
      author: { username: 'auteur' },
      subject: { name: 'Sujet' }
    };
    service.createPost(payload).subscribe(post => {
      expect(post).toEqual(created);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(created);
  });

  it('doit récupérer tous les articles', () => {
    const mockPosts: Post[] = [{
      id: 1,
      title: 'Titre',
      content: 'Contenu',
      createdAt: '',
      author: { username: 'auteur' },
      subject: { name: 'Sujet' }
    }];
    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/posts');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockPosts);
  });

  it('doit récupérer un article par id', () => {
    const post: Post = {
      id: 1,
      title: 'Titre',
      content: 'Contenu',
      createdAt: '',
      author: { username: 'auteur' },
      subject: { name: 'Sujet' }
    };
    service.getPostById(1).subscribe(result => {
      expect(result).toEqual(post);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/posts/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(post);
  });

  it('doit récupérer les commentaires d\'un article', () => {
    const mockComments = [{ id: 1, content: 'Commentaire' }];
    service.getComments(1).subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/posts/1/comments');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockComments);
  });

  it('doit ajouter un commentaire à un article', () => {
    const comment = { content: 'Nouveau commentaire' };
    const mockResp = { id: 1, content: 'Nouveau commentaire' };
    service.addComment(1, comment).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });
    const req = httpMock.expectOne('http://localhost:8080/api/posts/1/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(comment);
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResp);
  });
});
