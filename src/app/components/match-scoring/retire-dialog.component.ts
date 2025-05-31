import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player.model';
import { ButtonComponent } from '../shared/button/button.component';
import { SelectComponent } from '../shared/select/select.component';

export interface RetireDetails {
  retiredPlayerId: string;
  replacementPlayerId: string;
}

@Component({
  selector: 'app-retire-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelectComponent],
  template: `
    <div class="dialog-overlay">
      <div class="dialog-content">
        <h3>Retire Player</h3>
        
        <div class="form-group">
          <label>Player to Retire</label>
          <app-select
            [(ngModel)]="selectedRetiredPlayer"
            [required]="true"
          >
            <option [value]="currentBatsman">{{ getBatsmanName(currentBatsman) }}</option>
            <option [value]="nonStriker">{{ getBatsmanName(nonStriker) }}</option>
          </app-select>
        </div>

        <div class="form-group">
          <label>Replace With</label>
          <app-select
            [(ngModel)]="selectedReplacementPlayer"
            [required]="true"
          >
            <option *ngFor="let player of availablePlayers" [value]="player.id">
              {{ player.name }}
            </option>
          </app-select>
        </div>

        <div class="dialog-actions">
          <app-button
            variant="primary"
            [disabled]="!isValid"
            (onClick)="confirm()"
          >
            Confirm Retirement
          </app-button>
          <app-button
            variant="secondary"
            (onClick)="cancel()"
          >
            Cancel
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 1.5rem;
      color: #1B5E20;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .dialog-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class RetireDialogComponent {
  @Input() currentBatsman = '';
  @Input() nonStriker = '';
  @Input() availablePlayers: Player[] = [];
  @Input() currentPlayers: Player[] = [];
  @Output() onConfirm = new EventEmitter<RetireDetails>();
  @Output() onCancel = new EventEmitter<void>();

  selectedRetiredPlayer = '';
  selectedReplacementPlayer = '';

  get isValid(): boolean {
    return this.selectedRetiredPlayer !== '' && 
           this.selectedReplacementPlayer !== '' &&
           this.selectedRetiredPlayer !== this.selectedReplacementPlayer;
  }

  getBatsmanName(id: string): string {
    const player = this.currentPlayers.find(p => p.id === id);
    return player ? player.name : 'Unknown Player';
  }

  confirm(): void {
    if (this.isValid) {
      this.onConfirm.emit({
        retiredPlayerId: this.selectedRetiredPlayer,
        replacementPlayerId: this.selectedReplacementPlayer
      });
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}