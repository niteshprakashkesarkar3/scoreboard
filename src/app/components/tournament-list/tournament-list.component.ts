import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, ButtonComponent],
  template: `
    <app-list-layout
      title="Tournaments"
      itemName="Tournament"
      addRoute="/tournaments/add"
    >
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
              <app-button variant="edit" (onClick)="onEdit(tournament)">
                Edit
              </app-button>
              <app-button variant="danger" (onClick)="onDelete(tournament.id)">
                Delete
              </app-button>
            </td>
          </tr>
        </tbody>
      </table>
    </app-list-layout>
  `,
  styles: [`
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