import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bouton-retour',
  templateUrl: './bouton-retour.html',
  styleUrls: ['./bouton-retour.scss'],
  standalone: false,
})
export class BoutonRetourComponent {
  @Input() label: string = 'Retour';
  @Input() returnRoute: string | any[] = ['/'];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(Array.isArray(this.returnRoute) ? this.returnRoute : [this.returnRoute]);
  }
}
