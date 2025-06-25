import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: false,
})
export class NavbarComponent {
  public hideNavbar = false;
  public hideBurger = false;
  public hideLinks = false;
  public hideMobileMenu = false;
  public isMobile = false; // Ajouté
  mobileMenuOpen = false;

  private hideRoutes = ['/'];
  private logoOnlyRoutes = ['/login', '/register'];

  constructor(private router: Router) {
    this.updateIsMobile();
    window.addEventListener('resize', () => this.updateIsMobile());
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = this.hideRoutes.includes(this.router.url);
        this.hideBurger = this.hideRoutes.includes(this.router.url) || this.logoOnlyRoutes.includes(this.router.url);
        this.hideLinks = this.logoOnlyRoutes.includes(this.router.url);
        this.hideMobileMenu = this.logoOnlyRoutes.includes(this.router.url);
      }
    });
  }

  updateIsMobile() {
    this.isMobile = window.innerWidth <= 800;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}