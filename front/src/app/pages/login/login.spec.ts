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
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
    component.loginForm.setValue({ emailOrUsername: 'user', password: 'pass' });
    authServiceSpy.login.and.returnValue(of({}));
    component.onSubmit();
    tick();
    expect(authServiceSpy.login).toHaveBeenCalledWith({ emailOrUsername: 'user', password: 'pass' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post']);
    expect(component.error).toBe('');
  }));

  it('affiche une erreur si AuthService.login échoue', fakeAsync(() => {
    component.loginForm.setValue({ emailOrUsername: 'user', password: 'pass' });
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { error: 'Identifiants invalides' } })));
    component.onSubmit();
    tick();
    expect(component.error).toBe('Identifiants invalides');
  }));

  it('affiche une erreur générique si AuthService.login échoue sans message', fakeAsync(() => {
    component.loginForm.setValue({ emailOrUsername: 'user', password: 'pass' });
    authServiceSpy.login.and.returnValue(throwError(() => ({})));
    component.onSubmit();
    tick();
    expect(component.error).toBe('Erreur de connexion');
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
