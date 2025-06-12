import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Types pour le profil et les abonnements
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
}

export interface Subscription {
  id: number;
  subject: Subject;
  subscribedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/user/profile');
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>('/api/user/profile', data);
  }

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>('/api/user/subscriptions');
  }

  unsubscribe(subjectId: number): Observable<void> {
    return this.http.delete<void>(`/api/user/subscriptions/${subjectId}`);
  }
}