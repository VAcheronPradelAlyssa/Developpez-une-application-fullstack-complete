import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false, // This is not necessary unless you are using standalone components
})
export class AppComponent {
  title = 'front';
}
