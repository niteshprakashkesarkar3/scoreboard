import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'button ' + variant"
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .primary {
      background-color: #1B5E20;
      color: white;
    }

    .primary:hover:not(:disabled) {
      background-color: #154c1a;
    }

    .secondary {
      background-color: #f5f5f5;
      color: #333;
    }

    .secondary:hover:not(:disabled) {
      background-color: #e0e0e0;
    }

    .danger {
      background-color: #ffebee;
      color: #c62828;
    }

    .danger:hover:not(:disabled) {
      background-color: #ffcdd2;
    }

    .edit {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .edit:hover:not(:disabled) {
      background-color: #bbdefb;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'edit' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}