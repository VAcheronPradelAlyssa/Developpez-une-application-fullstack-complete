import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BoutonRetourComponent } from './bouton-retour';
import { By } from '@angular/platform-browser';

describe('BoutonRetourComponent', () => {
  let component: BoutonRetourComponent;
  let fixture: ComponentFixture<BoutonRetourComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [BoutonRetourComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoutonRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le label par défaut', () => {
    expect(component.label).toBe('Retour');
  });

  it('utilise le label personnalisé', () => {
    component.label = 'Précédent';
    fixture.detectChanges();
    expect(component.label).toBe('Précédent');
  });

  it('utilise la route de retour par défaut', () => {
    expect(component.returnRoute).toEqual(['/']);
  });

  it('utilise une route personnalisée', () => {
    component.returnRoute = ['/post'];
    fixture.detectChanges();
    expect(component.returnRoute).toEqual(['/post']);
  });

  it('goBack appelle router.navigate avec un tableau', () => {
    component.returnRoute = ['/post', 1];
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post', 1]);
  });

  it('goBack appelle router.navigate avec une string', () => {
    component.returnRoute = '/login';
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('le clic sur le bouton appelle goBack', () => {
    spyOn(component, 'goBack');
    const btn = fixture.debugElement.query(By.css('button.back-btn'));
    btn.triggerEventHandler('click');
    expect(component.goBack).toHaveBeenCalled();
  });
});

