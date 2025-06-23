import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutonRetour } from './bouton-retour';

describe('BoutonRetour', () => {
  let component: BoutonRetour;
  let fixture: ComponentFixture<BoutonRetour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutonRetour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutonRetour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
