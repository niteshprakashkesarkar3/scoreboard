import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tournament-form-container">
      <h2>Add Tournament</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Tournament ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="tournament.id" 
            required
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Tournament ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="name">Tournament Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="tournament.name" 
            required
            #name="ngModel">
          <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
            Tournament name is required
          </div>
        </div>

        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input 
            type="date" 
            id="startDate" 
            name="startDate" 
            [(ngModel)]="tournament.startDate" 
            required
            #startDate="ngModel">
          <div class="error" *ngIf="startDate.invalid && (startDate.dirty || startDate.touched)">
            Start date is required
          </div>
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input 
            type="date" 
            id="endDate" 
            name="endDate" 
            [(ngModel)]="tournament.endDate" 
            required
            #endDate="ngModel">
          <div class="error" *ngIf="endDate.invalid && (endDate.dirty || endDate.touched)">
            End date is required
          </div>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select 
            id="status" 
            name="status" 
            [(ngModel)]="tournament.status" 
            required
            #status="ngModel">
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="played">Played</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div class="error" *ngIf="status.invalid && (status.dirty || status.touched)">
            Status is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">Save Tournament</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .tournament-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    button[type="submit"] {
      background-color: #1B5E20;
      color: white;
    }

    button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button[type="button"] {
      background-color: #f5f5f5;
      color: #333;
    }
  `]
})
export class TournamentFormComponent {
  tournament: Tournament = {
    id: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'scheduled'
  };

  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.tournamentService.addTournament(this.tournament);
    this.router.navigate(['/tournaments']);
  }

  onCancel(): void {
    this.router.navigate(['/tournaments']);
  }
}