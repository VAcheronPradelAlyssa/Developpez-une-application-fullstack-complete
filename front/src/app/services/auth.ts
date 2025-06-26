import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  login(data: { emailOrUsername: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true });
  }

  /**
   * Vérifie la connexion en appelant une route protégée.
   */
  isLoggedIn(): Observable<boolean> {
    return this.http.get('/api/user/profile', { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false)) // Jamais d'erreur propagée
    );
  }
}