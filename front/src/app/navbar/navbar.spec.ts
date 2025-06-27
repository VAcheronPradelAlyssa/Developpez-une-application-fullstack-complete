import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from './navbar';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { of, Subject } from 'rxjs';

@Component({
  standalone: true,
  template: ''
})
class DummyComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let events$: Subject<any>;

  beforeEach(async () => {
    events$ = new Subject();
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        DummyComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: 'register', component: DummyComponent },
          { path: 'post', component: DummyComponent },
          { path: 'subject', component: DummyComponent },
          { path: 'logout', component: DummyComponent },
          { path: 'user-profile', component: DummyComponent }
        ]),
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit afficher la navbar par défaut', () => {
    component.hideNavbar = false;
    fixture.detectChanges();
    const nav = fixture.debugElement.query(By.css('nav.nav'));
    expect(nav).toBeTruthy();
  });

  it('doit masquer la navbar si hideNavbar true', () => {
    component.hideNavbar = true;
    fixture.detectChanges();
    
    // Vérifie que l'élément header n'est pas affiché car *ngIf="!hideNavbar"
    const header = fixture.debugElement.query(By.css('header.site-header'));
    expect(header).toBeNull();
  });

  it('doit ouvrir et fermer le menu mobile', () => {
    expect(component.mobileMenuOpen).toBeFalse();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeTrue();
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBeFalse();
  });

  it('doit afficher le menu mobile quand mobileMenuOpen est true', () => {
    component.mobileMenuOpen = true;
    component.hideNavbar = false;
    component.hideLinks = false;
    component.hideBurger = false;
    fixture.detectChanges();
    const mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu).toBeTruthy();
  });

  it('doit cacher le menu mobile quand mobileMenuOpen est false', () => {
    component.mobileMenuOpen = false;
    fixture.detectChanges();
    const mobileMenu = fixture.debugElement.query(By.css('.mobile-menu'));
    expect(mobileMenu).toBeNull();
  });

  it('doit appeler closeMobileMenu au clic sur un lien mobile', () => {
    component.mobileMenuOpen = true;
    component.hideNavbar = false;
    component.hideLinks = false;
    component.hideBurger = false;
    fixture.detectChanges();
    spyOn(component, 'closeMobileMenu');
    const mobileLinks = fixture.debugElement.queryAll(By.css('.mobile-menu .mobile-nav-link'));
    if (mobileLinks.length > 0) {
      mobileLinks.forEach(link => {
        link.triggerEventHandler('click', {});
      });
      expect(component.closeMobileMenu).toHaveBeenCalled();
    }
  });

  it('doit réagir aux changements de route et mettre à jour les propriétés', fakeAsync(() => {
    // Simule une navigation vers /login (logoOnlyRoutes)
    router.navigate(['/login']);
    tick();
    fixture.detectChanges();
    
    // Pour /login, hideBurger et hideLinks devraient être true
    expect(component.hideBurger).toBeTrue();
    expect(component.hideLinks).toBeTrue();

    // Simule une navigation vers /post (route normale)
    router.navigate(['/post']);
    tick();
    fixture.detectChanges();
    
    expect(component.hideBurger).toBeFalse();
    expect(component.hideLinks).toBeFalse();
  }));

  it('doit contenir le logo', () => {
    component.hideNavbar = false;
    fixture.detectChanges();
    const logo = fixture.debugElement.query(By.css('.logo-mdd'));
    expect(logo).toBeTruthy();
  });

  it('doit contenir les liens principaux quand hideLinks est false', () => {
    component.hideNavbar = false;
    component.hideLinks = false;
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('nav.nav a.nav-link'));
    expect(links.length).toBeGreaterThan(0);
    const logoutLink = links.find(l => l.nativeElement.textContent.includes('Se déconnecter'));
    expect(logoutLink).toBeTruthy();
  });

  it('doit contenir le bouton burger quand hideBurger est false', () => {
    component.hideNavbar = false;
    component.hideBurger = false;
    fixture.detectChanges();
    const burger = fixture.debugElement.query(By.css('button.burger'));
    expect(burger).toBeTruthy();
  });

  it('doit masquer les liens quand hideLinks est true', () => {
    component.hideNavbar = false;
    component.hideLinks = true;
    fixture.detectChanges();
    const nav = fixture.debugElement.query(By.css('nav.nav'));
    expect(nav).toBeNull(); // Car *ngIf="!hideLinks"
  });
});


