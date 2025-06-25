import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CardComponent } from 'src/app/shared/card/card';

import { PostComponent } from './post';
import { PostService } from 'src/app/services/posts/post';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPosts = [
    {
      id: 1,
      title: 'Titre 1',
      content: 'Contenu 1',
      createdAt: '2024-06-24T10:00:00Z',
      author: { username: 'user1' },
      subject: { name: 'Sujet1' }
    },
    {
      id: 2,
      title: 'Titre 2',
      content: 'Contenu 2',
      createdAt: '2024-06-25T10:00:00Z',
      author: { username: 'user2' },
      subject: { name: 'Sujet2' }
    }
  ];

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [
        PostComponent,
        CardComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge les articles au démarrage et trie par défaut', fakeAsync(() => {
    postServiceSpy.getPosts.and.returnValue(of([...mockPosts]));
    // Simule le localStorage pour forcer le tri 'desc'
    spyOn(window.localStorage, 'getItem').and.returnValue('desc');
    fixture.detectChanges();
    tick();
    expect(component.posts.length).toBe(2);
    expect(component.loading).toBeFalse();
    // Par défaut, tri desc : le plus récent d'abord
    expect(component.posts[0].id).toBe(2);
    expect(component.posts[1].id).toBe(1);
  }));

  it('affiche une erreur si le chargement échoue', fakeAsync(() => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    tick();
    expect(component.error).toBe('Erreur lors du chargement des articles');
    expect(component.loading).toBeFalse();
  }));

  it('toggleSort inverse le tri', () => {
    component.posts = [...mockPosts];
    component.sortBy = 'desc';
    component.toggleSort();
    expect(component.sortBy).toBe('asc');
    expect(component.posts[0].id).toBe(1);
    expect(component.posts[1].id).toBe(2);
    component.toggleSort();
    expect(component.sortBy).toBe('desc');
    expect(component.posts[0].id).toBe(2);
    expect(component.posts[1].id).toBe(1);
  });

  
});
