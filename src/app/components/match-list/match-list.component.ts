import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { StadiumService } from '../../services/stadium.service';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="match-list-container">
      <div class="header">
        <h2>Matches</h2>
        <button class="add-button" routerLink="/matches/add">Add Match</button>
      </div>

      <div class="table-container">
        <table class="match-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tournament</th>
              <th>Teams</th>
              <th>Stadium</th>
              <th>Scheduled At</th>
              <th>Status</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let match of matches">
              <td>{{ match.id }}</td>
              <td>{{ getTournamentName(match.tournament_id) }}</td>
              <td>
                {{ getTeamName(match.team1_id) }} vs {{ getTeamName(match.team2_id) }}
              </td>
              <td>{{ getStadiumName(match.stadium_id) }}</td>
              <td>{{ match.scheduled_at | date:'medium' }}</td>
              <td>
                <span class="status-badge" [class]="match.status">
                  {{ match.status | titlecase }}
                </span>
              </td>
              <td>
                <span *ngIf="match.winner_id">
                  {{ getTeamName(match.winner_id) }} {{ match.result }}
                </span>
              </td>
              <td class="actions">
                <button class="edit-button" (click)="onEdit(match)">Edit</button>
                <button class="delete-button" (click)="onDelete(match.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .match-list-container {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
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

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .match-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
      white-space: nowrap;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
      position: sticky;
      top: 0;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .status-badge.scheduled {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.in_progress {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.completed {
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
export class MatchListComponent implements OnInit {
  matches: Match[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private stadiumService: StadiumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.matchService.matches$.subscribe(matches => {
      this.matches = matches;
    });
  }

  getTeamName(teamId: string): string {
    let name = 'Unknown Team';
    this.teamService.teams$.subscribe(teams => {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        name = team.name;
      }
    });
    return name;
  }

  getTournamentName(tournamentId: string): string {
    let name = 'Unknown Tournament';
    this.tournamentService.tournaments$.subscribe(tournaments => {
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (tournament) {
        name = tournament.name;
      }
    });
    return name;
  }

  getStadiumName(stadiumId: string): string {
    let name = 'Unknown Stadium';
    this.stadiumService.stadiums$.subscribe(stadiums => {
      const stadium = stadiums.find(s => s.id === stadiumId);
      if (stadium) {
        name = stadium.name;
      }
    });
    return name;
  }

  onEdit(match: Match): void {
    this.router.navigate(['/matches/edit', match.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchService.deleteMatch(id);
    }
  }
}