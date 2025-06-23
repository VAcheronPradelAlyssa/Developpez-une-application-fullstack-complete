import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login';
import { AuthService } from 'src/app/services/auth';
import { BoutonRetourComponent } from 'src/app/shared/bouton-retour/bouton-retour';
import { PasswordFieldComponent } from 'src/app/shared/password-field/password-field';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        BoutonRetourComponent,
        PasswordFieldComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
