import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.html',
  styleUrls: ['./password-field.scss'],
  standalone: false,
})
export class PasswordFieldComponent {
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Mot de passe';
  @Input() required: boolean = false;

  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  showPassword = false;
}
