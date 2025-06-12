import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

// subscription.service.ts
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  subscribe(subjectId: number) {
    return this.http.post(`/api/subscriptions/${subjectId}`, {});
  }

  unsubscribe(subjectId: number) {
    return this.http.delete(`/api/subscriptions/${subjectId}`);
  }

  getUserSubscriptions(): Observable<number[]> {
    return this.http.get<number[]>(`/api/subscriptions`);
  }
}
