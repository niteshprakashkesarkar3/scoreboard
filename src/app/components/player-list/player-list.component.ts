import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="player-list-container">
      <div class="header">
        <h2>Players</h2>
        <button class="add-button" routerLink="/players/add">Add Player</button>
      </div>

      <div class="table-container">
        <table class="player-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Team</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let player of players">
              <td>{{ player.id }}</td>
              <td>{{ player.name }}</td>
              <td>{{ getTeamName(player.teamId) }}</td>
              <td>
                <span class="role-badge" *ngFor="let role of player.roles">
                  {{ role }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="player.status">
                  {{ player.status }}
                </span>
              </td>
              <td class="actions">
                <button class="edit-button" (click)="onEdit(player)">Edit</button>
                <button class="delete-button" (click)="onDelete(player.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .player-list-container {
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

    .player-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
      position: sticky;
      top: 0;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      margin: 0.125rem;
      border-radius: 4px;
      background-color: #e3f2fd;
      color: #1565c0;
      font-size: 0.875rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: capitalize;
      font-size: 0.875rem;
    }

    .status-badge.playing {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge.injured {
      background-color: #ffebee;
      color: #c62828;
    }

    .status-badge.not-playing {
      background-color: #f5f5f5;
      color: #666;
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
export class PlayerListComponent implements OnInit {
  players: Player[] = [];

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.playerService.players$.subscribe(players => {
      this.players = players;
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

  onEdit(player: Player): void {
    this.router.navigate(['/players/edit', player.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id);
    }
  }
}