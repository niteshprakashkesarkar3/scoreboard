import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} {{ itemName }}</h2>
      <form (ngSubmit)="onSubmit.emit()" #form="ngForm">
        <ng-content></ng-content>
        
        <div class="form-actions">
          <app-button 
            type="submit" 
            [disabled]="submitDisabled"
            variant="primary"
          >
            {{ isEditMode ? 'Update' : 'Save' }} {{ itemName }}
          </app-button>
          <app-button 
            type="button" 
            variant="secondary"
            (onClick)="onCancel.emit()"
          >
            Cancel
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-bottom: 2rem;
      color: #1B5E20;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }
    }
  `]
})
export class FormLayoutComponent {
  @Input() itemName = '';
  @Input() isEditMode = false;
  @Input() submitDisabled = false;
  
  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}