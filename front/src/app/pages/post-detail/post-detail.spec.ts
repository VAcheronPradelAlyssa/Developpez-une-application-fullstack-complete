import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';

import { PostDetailComponent } from './post-detail';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PostService } from 'src/app/services/posts/post';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let httpMock: HttpTestingController;

  const mockPost = {
    id: 1,
    title: 'Titre',
    content: 'Contenu',
    createdAt: '2024-06-24T10:00:00Z',
    author: { username: 'user' },
    subject: { name: 'Sujet' }
  };
  const mockComments = [
    { id: 1, content: 'Commentaire', author: { username: 'user' } }
  ];

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts', 'getComments', 'addComment']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [
        PostDetailComponent,
        BoutonRetourComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge le post et les commentaires au démarrage', fakeAsync(() => {
    postServiceSpy.getPosts.and.returnValue(of([mockPost]));
    postServiceSpy.getComments.and.returnValue(of(mockComments));
    fixture.detectChanges();
    tick();
    expect(component.post.title).toBe('Titre');
    expect(component.comments.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('addComment ajoute un commentaire et recharge la liste', fakeAsync(() => {
    postServiceSpy.getPosts.and.returnValue(of([mockPost]));
    postServiceSpy.getComments.and.returnValue(of([]));
    postServiceSpy.addComment.and.returnValue(of({}));
    fixture.detectChanges();
    tick();
    component.post = mockPost;
    component.newComment = 'Nouveau';
    postServiceSpy.getComments.and.returnValue(of([{ id: 2, content: 'Nouveau', author: { username: 'user' } }]));
    component.addComment();
    tick();
    expect(postServiceSpy.addComment).toHaveBeenCalledWith(1, { content: 'Nouveau' });
    expect(component.newComment).toBe('');
    expect(component.comments.length).toBe(1);
    expect(component.comments[0].content).toBe('Nouveau');
  }));

  it('addComment ne fait rien si le commentaire est vide', () => {
    component.newComment = '   ';
    component.post = mockPost;
    component.comments = [];
    component.addComment();
    expect(postServiceSpy.addComment).not.toHaveBeenCalled();
    expect(component.comments.length).toBe(0);
  });

  it('goBack appelle location.back', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
