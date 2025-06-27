import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from 'src/app/services/auth';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PasswordFieldComponent } from 'src/app/shared/password-field/password-field';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure le comportement par défaut de isLoggedIn
    authServiceSpy.isLoggedIn.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire invalide si vide', () => {
    component.loginForm.setValue({ emailOrUsername: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('formulaire valide si rempli', () => {
    component.loginForm.setValue({ emailOrUsername: 'user', password: 'pass' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('ne soumet pas si formulaire invalide', () => {
    component.loginForm.setValue({ emailOrUsername: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('appelle AuthService.login et redirige si succès', fakeAsync(() => {
    component.loginForm.setValue({ emailOrUsername: 'user@test.com', password: 'Test1234!' });
    authServiceSpy.login.and.returnValue(of({}));
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith({ emailOrUsername: 'user@test.com', password: 'Test1234!' });
    expect(component.success).toBeTrue();
    
    // Attendre le setTimeout de 500ms dans le composant
    tick(500);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post']);
  }));

  it('affiche une erreur si AuthService.login échoue', fakeAsync(() => {
    component.loginForm.setValue({ emailOrUsername: 'user@test.com', password: 'wrong' });
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Identifiants invalides' } })));
    component.onSubmit();
    tick();
    
    // L'ErrorInterceptor gère les erreurs automatiquement
    // Le composant ne stocke plus les erreurs dans component.error
    expect(component.success).toBeFalse();
    // Vérifier que la navigation n'a pas eu lieu
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('affiche une erreur générique si AuthService.login échoue sans message', fakeAsync(() => {
    component.loginForm.setValue({ emailOrUsername: 'user@test.com', password: 'wrong' });
    authServiceSpy.login.and.returnValue(throwError(() => ({})));
    component.onSubmit();
    tick();
    
    // L'ErrorInterceptor gère les erreurs automatiquement
    expect(component.success).toBeFalse();
    // Vérifier que la navigation n'a pas eu lieu
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('get passwordControl retourne le contrôle du mot de passe', () => {
    const passwordCtrl = component.loginForm.get('password');
    expect(component.passwordControl).toBe(passwordCtrl as any);
  });

  it('goBack redirige vers la page d\'accueil', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
