import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { CreatePostComponent } from './create-post';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PostService } from 'src/app/services/posts/post';
import { SubjectService } from 'src/app/services/subject/subject';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let subjectServiceSpy: jasmine.SpyObj<SubjectService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  const mockSubjects = [
    { id: 1, name: 'Sujet1', description: 'Desc1' },
    { id: 2, name: 'Sujet2', description: 'Desc2' }
  ];

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['createPost']);
    subjectServiceSpy = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent, BoutonRetourComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: SubjectService, useValue: subjectServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge les sujets au démarrage', fakeAsync(() => {
    subjectServiceSpy.getAllSubjects.and.returnValue(of(mockSubjects));
    fixture.detectChanges();
    tick();
    expect(component.subjects).toEqual(mockSubjects);
    expect(component.filteredSubjects).toEqual(mockSubjects);
  }));

  it('affiche une alerte si le chargement des sujets échoue', fakeAsync(() => {
    spyOn(window, 'alert');
    subjectServiceSpy.getAllSubjects.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors du chargement des sujets');
  }));

  it('filtre les sujets avec onSubjectInput', () => {
    component.subjects = mockSubjects;
    component.postForm.patchValue({ subjectName: 'sujet1' });
    component.onSubjectInput();
    expect(component.filteredSubjects.length).toBe(1);
    expect(component.filteredSubjects[0].name).toBe('Sujet1');
  });

  it('selectSubject met à jour le champ et masque les options', () => {
    component.selectSubject(mockSubjects[1]);
    expect(component.postForm.value.subjectName).toBe('Sujet2');
    expect(component.showSubjectOptions).toBeFalse();
  });

  it('onSubmit affiche une alerte si le thème est invalide', () => {
    spyOn(window, 'alert');
    component.subjects = mockSubjects;
    component.postForm.setValue({ subjectName: 'Inexistant', title: 'Titre', content: 'Contenu' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Veuillez sélectionner un thème valide.');
  });

  it('onSubmit appelle le service et redirige si succès', fakeAsync(() => {
    spyOn(window, 'alert');
    subjectServiceSpy.getAllSubjects.and.returnValue(of(mockSubjects));
    postServiceSpy.createPost.and.returnValue(of({}));
    component.subjects = mockSubjects;
    component.postForm.setValue({ subjectName: 'Sujet1', title: 'Titre', content: 'Contenu' });
    component.onSubmit();
    tick();
    expect(postServiceSpy.createPost).toHaveBeenCalledWith({
      title: 'Titre',
      content: 'Contenu',
      subjectId: 1
    });
    expect(window.alert).toHaveBeenCalledWith('Article créé !');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post']);
  }));

  it('onSubmit affiche une erreur si la création échoue', fakeAsync(() => {
    spyOn(window, 'alert');
    postServiceSpy.createPost.and.returnValue(throwError(() => new Error('fail')));
    component.subjects = mockSubjects;
    component.postForm.setValue({ subjectName: 'Sujet1', title: 'Titre', content: 'Contenu' });
    component.onSubmit();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la création de l\'article');
  }));

  it('goBack appelle location.back', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
