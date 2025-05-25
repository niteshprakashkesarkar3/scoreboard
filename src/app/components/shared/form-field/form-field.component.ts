import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field">
      <label [for]="id">{{ label }}</label>
      <ng-content></ng-content>
      <div class="error" *ngIf="showError">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    :host ::ng-deep input,
    :host ::ng-deep select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    :host ::ng-deep input[readonly] {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    :host ::ng-deep input[type="number"] {
      -moz-appearance: textfield;
    }

    :host ::ng-deep input[type="number"]::-webkit-outer-spin-button,
    :host ::ng-deep input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class FormFieldComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() showError = false;
  @Input() errorMessage = '';
}