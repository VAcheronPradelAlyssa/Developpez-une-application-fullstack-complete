import { Component, OnInit } from '@angular/core';
import { Subscription, UserProfile, UserService, Subscription as UserSubscription } from 'src/app/services/user/user-profil';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profil.html',
  styleUrls: ['./user-profil.scss'],
  standalone: false,
})
export class UserProfileComponent implements OnInit {
  user: UserProfile = { id: 0, username: '', email: '', password: '' };
subscriptions: Subscription[] = [];
  loading = true;
  saving = false;
  error = '';
  success = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
    this.loadSubscriptions();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.user = { ...profile, password: '' };
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger le profil.";
        this.loading = false;
      }
    });
  }

  loadSubscriptions() {
    this.userService.getSubscriptions().subscribe({
      next: (subs) => this.subscriptions = subs,
      error: () => this.error = "Impossible de charger les abonnements."
    });
  }

  saveProfile() {
    this.saving = true;
    this.error = '';
    this.success = '';
    const { username, email, password } = this.user;
    const data: any = { username, email };
    if (password) data.password = password;

    this.userService.updateProfile(data).subscribe({
      next: (updated) => {
        this.user = { ...updated, password: '' };
        this.success = "Profil mis à jour !";
        this.saving = false;
      },
      error: () => {
        this.error = "Erreur lors de la mise à jour.";
        this.saving = false;
      }
    });
  }

  unsubscribe(subjectId: number) {
    this.userService.unsubscribe(subjectId).subscribe({
      next: () => {
        this.subscriptions = this.subscriptions.filter(s => s.subject.id !== subjectId);
      },
      error: () => {
        this.error = "Erreur lors du désabonnement.";
      }
    });
  }
}