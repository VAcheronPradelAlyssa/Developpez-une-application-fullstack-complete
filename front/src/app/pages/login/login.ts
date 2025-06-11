import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.error = '';
    this.success = false;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.success = true;
        // Redirection immédiate vers /post après connexion réussie
        this.router.navigate(['/post']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur de connexion';
      }
    });
  }
}