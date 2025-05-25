import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="team-list-container">
      <div class="header">
        <h2>Teams</h2>
        <button class="add-button" routerLink="/teams/add">Add Team</button>
      </div>

      <table class="team-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tournament</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let team of teams">
            <td>{{ team.id }}</td>
            <td>{{ team.name }}</td>
            <td>{{ getTournamentName(team.tournamentId) }}</td>
            <td>{{ getGroupName(team.groupId) }}</td>
            <td class="actions">
              <button class="edit-button" (click)="onEdit(team)">Edit</button>
              <button class="delete-button" (click)="onDelete(team.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .team-list-container {
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

    .team-table {
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
export class TeamListComponent implements OnInit {
  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });
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

  getGroupName(groupId: string): string {
    let name = 'Unknown Group';
    this.groupService.groups$.subscribe(groups => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        name = group.name;
      }
    });
    return name;
  }

  onEdit(team: Team): void {
    this.router.navigate(['/teams/edit', team.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamService.deleteTeam(id);
    }
  }
}