import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
  standalone: false,
})
export class LogoutComponent {
  constructor(private router: Router, private http: HttpClient) {
    // Appelle simplement l'API logout avec les credentials (cookie)
    this.http.post('/api/auth/logout', {}, { withCredentials: true }).subscribe({
      complete: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}