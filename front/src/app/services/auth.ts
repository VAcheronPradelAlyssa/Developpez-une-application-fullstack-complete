import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { emailOrUsername: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}