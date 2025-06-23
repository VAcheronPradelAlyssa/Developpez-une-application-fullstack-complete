import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bouton-retour',
  templateUrl: './bouton-retour.html',
  styleUrls: ['./bouton-retour.scss'],
  standalone: false,
})
export class BoutonRetourComponent {
  @Input() label: string = 'Retour';

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
