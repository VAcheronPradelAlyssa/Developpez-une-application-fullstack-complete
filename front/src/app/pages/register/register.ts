import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
    this.location.back();
  }
}