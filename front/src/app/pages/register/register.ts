import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false,
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string = '';
  success: boolean = false;
  showPasswordRules = false;

  passwordChecks = {
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false
  };

  alreadyLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required, this.passwordValidator]]
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => this.onPasswordInput());
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLogged => {
      if (isLogged) {
        this.alreadyLoggedIn = true;
        setTimeout(() => {
          this.router.navigate(['/post']);
        }, 1800);
      }
    });
  }

  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(value) ? null : { passwordInvalid: true };
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^[^@]+@[^@]+\.[^@]+$/;
    return regex.test(value) ? null : { email: true };
  }

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
      next: (res) => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/post']);
        }, 500);
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          err?.error ||
          err?.message ||
          'Une erreur est survenue';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}