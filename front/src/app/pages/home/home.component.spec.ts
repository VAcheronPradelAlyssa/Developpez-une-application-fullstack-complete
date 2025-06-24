import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher le logo', () => {
    const img = fixture.debugElement.query(By.css('img[alt="logo"]'));
    expect(img).toBeTruthy();
  });

  it('doit afficher le bouton Se connecter', () => {
    const btn = fixture.debugElement.query(By.css('button[routerLink="/login"]'));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent).toContain('Se connecter');
  });

  it('doit afficher le bouton S\'inscrire', () => {
    const btn = fixture.debugElement.query(By.css('button[routerLink="/register"]'));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent).toContain("S'inscrire");
  });
});

