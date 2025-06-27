import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  // Injection de dépendance native Angular
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Utiliser la méthode silencieuse pour éviter les erreurs 403
    this.authService.checkAuthStatusSilent().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }
}