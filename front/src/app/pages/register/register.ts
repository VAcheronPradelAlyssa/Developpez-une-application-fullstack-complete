import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false,
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  success: boolean = false;
  showPasswordRules = false;

  // Ajout pour l'analyse dynamique du mot de passe
  passwordChecks = {
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]]
    });

    // Ajoute l'écoute sur le champ password pour analyse dynamique
    this.registerForm.get('password')?.valueChanges.subscribe(() => this.onPasswordInput());
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(value) ? null : { passwordInvalid: true };
  }

  // Analyse dynamique du mot de passe
  onPasswordInput() {
    const value = this.registerForm.get('password')?.value || '';
    this.passwordChecks.length = value.length >= 8;
    this.passwordChecks.lowercase = /[a-z]/.test(value);
    this.passwordChecks.uppercase = /[A-Z]/.test(value);
    this.passwordChecks.digit = /\d/.test(value);
    this.passwordChecks.special = /[^A-Za-z0-9]/.test(value);
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.error = '';
    this.success = false;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}