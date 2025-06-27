import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { CreatePostComponent } from './create-post';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PostService } from 'src/app/services/posts/post';
import { SubjectService } from 'src/app/services/subject/subject';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let subjectServiceSpy: jasmine.SpyObj<SubjectService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockSubjects = [
    { id: 1, name: 'Sujet1', description: 'Desc1' },
    { id: 2, name: 'Sujet2', description: 'Desc2' }
  ];

  beforeEach(async () => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['createPost']);
    subjectServiceSpy = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure le comportement par défaut pour éviter l'erreur lors du ngOnInit
    subjectServiceSpy.getAllSubjects.and.returnValue(of([]));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [
        CreatePostComponent,
        BoutonRetourComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: SubjectService, useValue: subjectServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('charge les sujets au démarrage', fakeAsync(() => {
    // Reconfigure le spy pour ce test spécifique
    subjectServiceSpy.getAllSubjects.and.returnValue(of(mockSubjects));
    
    // Appelle ngOnInit manuellement
    component.ngOnInit();
    tick();
    
    expect(component.subjects).toEqual(mockSubjects);
    expect(component.filteredSubjects).toEqual(mockSubjects);
  }));

  it('affiche une alerte si le chargement des sujets échoue', fakeAsync(() => {
    spyOn(window, 'alert');
    
    // Reconfigure le spy pour retourner une erreur
    subjectServiceSpy.getAllSubjects.and.returnValue(throwError(() => new Error('fail')));
    
    // Appelle ngOnInit manuellement
    component.ngOnInit();
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
    
    // Configure les spies
    postServiceSpy.createPost.and.returnValue(of({}));
    
    // Prépare les données
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

  it('doit avoir un formulaire avec les bons champs', () => {
    expect(component.postForm.get('subjectName')).toBeTruthy();
    expect(component.postForm.get('title')).toBeTruthy();
    expect(component.postForm.get('content')).toBeTruthy();
  });

  it('le formulaire est invalide si les champs requis sont vides', () => {
    component.postForm.setValue({ subjectName: '', title: '', content: '' });
    expect(component.postForm.invalid).toBeTrue();
  });

  it('le formulaire est valide si tous les champs sont remplis', () => {
    component.postForm.setValue({ subjectName: 'Sujet1', title: 'Titre', content: 'Contenu' });
    expect(component.postForm.valid).toBeTrue();
  });
});
