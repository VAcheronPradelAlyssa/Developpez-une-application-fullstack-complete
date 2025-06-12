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

  constructor(
    private subjectService: SubjectService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => this.subjects = subjects,
      error: () => alert('Erreur lors du chargement des sujets')
    });
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionService.getUserSubscriptions().subscribe({
      next: (subs: any[]) => this.subscribedIds = subs.map(sub => sub.subject ? sub.subject.id : sub),
      error: () => alert('Erreur lors du chargement des abonnements')
    });
  }

  isSubscribed(subjectId: number): boolean {
    return this.subscribedIds.includes(subjectId);
  }

  toggleSubscription(subjectId: number) {
    if (this.isSubscribed(subjectId)) {
      this.subscriptionService.unsubscribe(subjectId).subscribe({
        next: () => this.loadSubscriptions(),
        error: () => alert('Erreur lors de la désinscription')
      });
    } else {
      this.subscriptionService.subscribe(subjectId).subscribe({
        next: () => this.loadSubscriptions(),
        error: () => alert('Erreur lors de l\'abonnement')
      });
    }
  }
}