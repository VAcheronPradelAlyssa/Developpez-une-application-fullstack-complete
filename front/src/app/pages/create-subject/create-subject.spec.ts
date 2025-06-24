import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CreateSubjectComponent } from './create-subject';
import { SubjectService } from 'src/app/services/subject/subject';

describe('CreateSubjectComponent', () => {
  let component: CreateSubjectComponent;
  let fixture: ComponentFixture<CreateSubjectComponent>;
  let subjectServiceSpy: jasmine.SpyObj<SubjectService>;

  beforeEach(async () => {
    subjectServiceSpy = jasmine.createSpyObj('SubjectService', ['createSubject']);

    await TestBed.configureTestingModule({
      declarations: [CreateSubjectComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: SubjectService, useValue: subjectServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit initialiser le formulaire avec des champs vides', () => {
    expect(component.subjectForm.value).toEqual({ name: '', description: '' });
    expect(component.subjectForm.valid).toBeFalse();
  });

  it('le formulaire est invalide si un champ est vide', () => {
    component.subjectForm.setValue({ name: '', description: 'desc' });
    expect(component.subjectForm.invalid).toBeTrue();
    component.subjectForm.setValue({ name: 'nom', description: '' });
    expect(component.subjectForm.invalid).toBeTrue();
  });

  it('le formulaire est valide si tous les champs sont remplis', () => {
    component.subjectForm.setValue({ name: 'nom', description: 'desc' });
    expect(component.subjectForm.valid).toBeTrue();
  });

  it('onSubmit ne fait rien si le formulaire est invalide', () => {
    // PAS de spyOn ici car déjà spyé dans beforeEach
    component.subjectForm.setValue({ name: '', description: '' });
    component.onSubmit();
    expect(subjectServiceSpy.createSubject).not.toHaveBeenCalled();
  });

  it('onSubmit appelle le service et affiche une alerte si succès', fakeAsync(() => {
    spyOn(window, 'alert');
    component.subjectForm.setValue({ name: 'nom', description: 'desc' });
    subjectServiceSpy.createSubject.and.returnValue(of({ id: 1, name: 'nom', description: 'desc' }));
    component.onSubmit();
    tick();
    // Ajoute id: jasmine.any(Number) pour matcher l'interface attendue
    expect(subjectServiceSpy.createSubject).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'nom', description: 'desc' }));
    expect(window.alert).toHaveBeenCalledWith('Sujet créé !');
  }));

  it('onSubmit affiche une erreur si le service échoue', fakeAsync(() => {
    spyOn(window, 'alert');
    component.subjectForm.setValue({ name: 'nom', description: 'desc' });
    subjectServiceSpy.createSubject.and.returnValue(throwError(() => new Error('fail')));
    component.onSubmit();
    tick();
    expect(window.alert).toHaveBeenCalledWith('Erreur lors de la création');
  }));
});
