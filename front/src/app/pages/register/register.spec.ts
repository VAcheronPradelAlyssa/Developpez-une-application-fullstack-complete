import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PasswordFieldComponent } from 'src/app/shared/password-field/password-field';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure le comportement par défaut de isLoggedIn
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        BoutonRetourComponent,
        PasswordFieldComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire invalide si vide', () => {
    component.registerForm.setValue({ username: '', email: '', password: '' });
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('formulaire valide si rempli et mot de passe correct', () => {
    component.registerForm.setValue({ username: 'user', email: 'user@test.com', password: 'Test1234!' });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('ne soumet pas si formulaire invalide', () => {
    component.registerForm.setValue({ username: '', email: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('appelle AuthService.register et redirige si succès', fakeAsync(() => {
    component.registerForm.setValue({ username: 'user', email: 'user@test.com', password: 'Test1234!' });
    authServiceSpy.register.and.returnValue(of({}));
    component.onSubmit();
    tick(500);
    expect(authServiceSpy.register).toHaveBeenCalledWith({ username: 'user', email: 'user@test.com', password: 'Test1234!' });
    expect(component.success).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post']);
  }));

  it('affiche une erreur si AuthService.register échoue', fakeAsync(() => {
    component.registerForm.setValue({ username: 'user', email: 'user@test.com', password: 'Test1234!' });
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Email déjà utilisé' } })));
    component.onSubmit();
    tick();
    // ErrorInterceptor gère maintenant les erreurs automatiquement
    expect(component.success).toBeFalse();
  }));

  it('affiche une erreur générique si AuthService.register échoue sans message', fakeAsync(() => {
    component.registerForm.setValue({ username: 'user', email: 'user@test.com', password: 'Test1234!' });
    authServiceSpy.register.and.returnValue(throwError(() => ({})));
    component.onSubmit();
    tick();
    // ErrorInterceptor gère maintenant les erreurs automatiquement
    expect(component.success).toBeFalse();
  }));

  it('get passwordControl retourne le contrôle du mot de passe', () => {
    const passwordCtrl = component.registerForm.get('password');
    expect(component.passwordControl).toBe(passwordCtrl as any);
  });

  it('goBack redirige vers la page d\'accueil', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('passwordValidator valide un mot de passe correct', () => {
    const ctrl = { value: 'Test1234!' } as any;
    expect(component.passwordValidator(ctrl)).toBeNull();
  });

  it('passwordValidator invalide un mot de passe trop simple', () => {
    const ctrl = { value: 'abc' } as any;
    expect(component.passwordValidator(ctrl)).toEqual({ passwordInvalid: true });
  });

  it('emailValidator valide un email correct', () => {
    const ctrl = { value: 'user@test.com' } as any;
    expect(component.emailValidator(ctrl)).toBeNull();
  });

  it('emailValidator invalide un mauvais email', () => {
    const ctrl = { value: 'notanemail' } as any;
    expect(component.emailValidator(ctrl)).toEqual({ email: true });
  });

  it('onPasswordInput met à jour les règles', () => {
    component.registerForm.get('password')?.setValue('Test1234!');
    component.onPasswordInput();
    expect(component.passwordChecks.length).toBeTrue();
    expect(component.passwordChecks.lowercase).toBeTrue();
    expect(component.passwordChecks.uppercase).toBeTrue();
    expect(component.passwordChecks.digit).toBeTrue();
    expect(component.passwordChecks.special).toBeTrue();
  });
});
