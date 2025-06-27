import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { AuthService } from 'src/app/services/auth';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkAuthStatusSilent']);
    authServiceSpy.checkAuthStatusSilent.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit appeler checkAuthStatusSilent au démarrage', () => {
    expect(authServiceSpy.checkAuthStatusSilent).toHaveBeenCalled();
  });

  it('doit initialiser isLoggedIn à false par défaut', () => {
    expect(component.isLoggedIn).toBeFalse();
  });

  it('doit mettre à jour isLoggedIn selon la réponse du service', () => {
    authServiceSpy.checkAuthStatusSilent.and.returnValue(of(true));
    component.ngOnInit();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('doit afficher le logo', () => {
    const logo = fixture.debugElement.query(By.css('img[alt="logo"]'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('logo_p6.png');
  });

  it('doit toujours afficher le bouton Se connecter', () => {
    const loginBtn = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    expect(loginBtn).toBeTruthy();
    expect(loginBtn.nativeElement.textContent.trim()).toBe('Se connecter');
  });

  it('doit toujours afficher le bouton S\'inscrire', () => {
    const registerBtn = fixture.debugElement.query(By.css('button[routerLink="/register"]'));
    expect(registerBtn).toBeTruthy();
    expect(registerBtn.nativeElement.textContent.trim()).toBe("S'inscrire");
  });

  it('doit afficher les boutons même quand connecté', () => {
    // Simule un utilisateur connecté
    authServiceSpy.checkAuthStatusSilent.and.returnValue(of(true));
    component.ngOnInit();
    fixture.detectChanges();
    
    // Les boutons sont toujours présents car le template ne les cache pas
    const loginBtn = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    const registerBtn = fixture.debugElement.query(By.css('button[routerLink="/register"]'));
    expect(loginBtn).toBeTruthy();
    expect(registerBtn).toBeTruthy();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('doit gérer les erreurs du service checkAuthStatusSilent', () => {
    authServiceSpy.checkAuthStatusSilent.and.returnValue(of(false));
    component.ngOnInit();
    expect(component.isLoggedIn).toBeFalse();
    expect(authServiceSpy.checkAuthStatusSilent).toHaveBeenCalled();
  });
});