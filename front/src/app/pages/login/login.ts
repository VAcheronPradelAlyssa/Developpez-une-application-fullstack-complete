import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  success: boolean = false;
  submitted = false;
  alreadyLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
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
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.error = '';
    this.success = false;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/post']);
      },
      error: (err) => {
        this.error = err?.error?.error || err?.error?.message || 'Erreur de connexion';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}