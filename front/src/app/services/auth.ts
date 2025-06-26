import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserProfile } from './user/user-profil';

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

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  /**
   * Vérifie la connexion en appelant une route protégée.
   * Silencieux - ne génère pas d'erreurs visibles pour l'utilisateur.
   */
  isLoggedIn(): Observable<boolean> {
    return this.http.get<UserProfile>('/api/user/profile', { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Version silencieuse pour les pages publiques (home)
   * Ne doit pas déclencher l'ErrorInterceptor
   */
  checkAuthStatusSilent(): Observable<boolean> {
    return this.http.get<UserProfile>('/api/user/profile', { 
      withCredentials: true,
      headers: { 'X-Silent-Request': 'true' }
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}

// PROBLÈME : localStorage n'est pas sécurisé
// localStorage.setItem('token', token); // ❌ Vulnérable aux attaques XSS

// SOLUTION : Utiliser les cookies HttpOnly (déjà implémenté côté serveur)
// Le token est automatiquement géré par les cookies sécurisés