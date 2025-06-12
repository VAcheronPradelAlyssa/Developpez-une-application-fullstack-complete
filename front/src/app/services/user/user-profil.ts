import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface Subscription {
  id: number;
  subject: {
    id: number;
    name: string;
    description: string;
  };
  subscribedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`/api/user/profile`);
  }

  updateProfile(user: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`/api/user/profile`, user);
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`/api/subscriptions`);
  }

  unsubscribe(subjectId: number): Observable<void> {
    return this.http.delete<void>(`/api/subscriptions/${subjectId}`);
  }
}