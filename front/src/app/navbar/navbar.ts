import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: false,
})
export class NavbarComponent {
  public lightNavbar = false;
  private lightRoutes = ['/login', '/register'];
  mobileMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.lightNavbar = this.lightRoutes.includes(this.router.url);
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}