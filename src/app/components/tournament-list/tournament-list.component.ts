import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tournament-list-container">
      <div class="header">
        <h2>Tournaments</h2>
        <button class="add-button" routerLink="/tournaments/add">Add Tournament</button>
      </div>

      <table class="tournament-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tournament of tournaments">
            <td>{{ tournament.id }}</td>
            <td>{{ tournament.name }}</td>
            <td>{{ tournament.startDate | date:'mediumDate' }}</td>
            <td>{{ tournament.endDate | date:'mediumDate' }}</td>
            <td>
              <span class="status-badge" [class]="tournament.status">
                {{ tournament.status }}
              </span>
            </td>
            <td class="actions">
              <button class="edit-button" (click)="onEdit(tournament)">Edit</button>
              <button class="delete-button" (click)="onDelete(tournament.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .tournament-list-container {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .add-button {
      padding: 0.5rem 1rem;
      background-color: #1B5E20;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .tournament-table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: capitalize;
    }

    .status-badge.scheduled {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.ongoing {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.played {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-button, .delete-button {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .edit-button {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .delete-button {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];

  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournamentService.tournaments$.subscribe(tournaments => {
      this.tournaments = tournaments;
    });
  }

  onEdit(tournament: Tournament): void {
    this.router.navigate(['/tournaments/edit', tournament.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this tournament?')) {
      this.tournamentService.deleteTournament(id);
    }
  }
}