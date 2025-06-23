import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  standalone: false,
})
export class CardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() meta1?: string; // Pour date ou autre info
  @Input() meta2?: string; // Pour auteur ou autre info
}
