import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CardComponent } from './card';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche le titre', () => {
    component.title = 'Mon titre';
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.card-title'));
    expect(title.nativeElement.textContent).toContain('Mon titre');
  });

  it('affiche la description', () => {
    component.description = 'Ma description';
    fixture.detectChanges();
    const desc = fixture.debugElement.query(By.css('.card-content'));
    expect(desc.nativeElement.textContent).toContain('Ma description');
  });

  it('affiche meta1 et meta2 si présents', () => {
    component.meta1 = 'Date';
    component.meta2 = 'Auteur';
    fixture.detectChanges();
    const meta = fixture.debugElement.query(By.css('.card-meta'));
    expect(meta.nativeElement.textContent).toContain('Date');
    expect(meta.nativeElement.textContent).toContain('Auteur');
  });

  it('n\'affiche pas .card-meta si meta1 et meta2 sont absents', () => {
    component.meta1 = undefined;
    component.meta2 = undefined;
    fixture.detectChanges();
    const meta = fixture.debugElement.query(By.css('.card-meta'));
    expect(meta).toBeNull();
  });

  
});
