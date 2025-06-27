import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  passwordControl = new FormControl('');

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
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this.success = '';

    const updateData: any = {
      username: this.user.username,
      email: this.user.email
    };

    // Ajouter le mot de passe seulement s'il a été modifié
    if (this.passwordControl.value && this.passwordControl.value.trim()) {
      updateData.password = this.passwordControl.value;
    }

    this.userService.updateProfile(updateData).subscribe({
      next: () => {
        this.success = 'Profil mis à jour !';
        this.saving = false;
        // Réinitialiser le champ mot de passe
        this.passwordControl.setValue('');
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour.';
        this.saving = false;
      }
    });
  }

  unsubscribe(subjectId: number) {
    this.userService.unsubscribe(subjectId).subscribe({
      next: () => {
        this.subscriptions = this.subscriptions.filter(s => s.subjectId !== subjectId);
      },
      error: () => {
        this.error = "Erreur lors du désabonnement.";
      }
    });
  }
}