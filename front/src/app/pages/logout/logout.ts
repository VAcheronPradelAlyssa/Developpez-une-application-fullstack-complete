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
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        complete: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}