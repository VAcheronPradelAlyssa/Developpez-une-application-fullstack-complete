import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: false,
})
export class NotFoundComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Si isLoggedIn() retourne un Observable<boolean>
    this.authService.isLoggedIn().subscribe(val => {
      this.isLoggedIn = val;
    });
  }

  goHome() {
    if (this.isLoggedIn) {
      this.router.navigate(['/post']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
