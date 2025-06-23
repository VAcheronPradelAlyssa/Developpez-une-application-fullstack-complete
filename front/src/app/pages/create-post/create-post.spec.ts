import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CreatePostComponent } from './create-post';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreatePostComponent,
        BoutonRetourComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
