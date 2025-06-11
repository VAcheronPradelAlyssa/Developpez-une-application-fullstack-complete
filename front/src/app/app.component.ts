import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false, // Permet de l'utiliser dans d'autres composants
})
export class AppComponent {
  showNavbar = true;
  hideNavbarRoutes = ['/']; // Seule la page d'accueil n'a aucune navbar

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.hideNavbarRoutes.includes(this.router.url);
      }
    });
  }
}