import { Component, OnInit } from '@angular/core';
import { SubjectDTO } from '../../models/subject.dto';
import { SubjectService } from 'src/app/services/subject/subject';
import { SubscriptionService } from 'src/app/services/subscription/subscription';

@Component({
  selector: 'app-list-subject',
  templateUrl: './list-subject.html',
  styleUrls: ['./list-subject.scss'],
  standalone: false,
})
export class ListSubjectComponent implements OnInit {
  subjects: SubjectDTO[] = [];
  subscribedIds: number[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private subjectService: SubjectService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des sujets';
        this.loading = false;
      }
    });
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionService.getUserSubscriptions().subscribe({
      next: (subs: any[]) => this.subscribedIds = subs.map(sub => sub.subjectId),
      error: () => { this.subscribedIds = []; }
    });
  }

  isSubscribed(subjectId: number): boolean {
    return this.subscribedIds.includes(subjectId);
  }

  toggleSubscription(subjectId: number) {
    if (this.isSubscribed(subjectId)) {
      this.subscriptionService.unsubscribe(subjectId).subscribe({
        next: () => this.loadSubscriptions(), // recharge après désabonnement
        error: () => alert('Erreur lors de la désinscription')
      });
    } else {
      this.subscriptionService.subscribe(subjectId).subscribe({
        next: () => this.loadSubscriptions(), // recharge après abonnement
        error: () => alert('Erreur lors de l\'abonnement')
      });
    }
  }
}