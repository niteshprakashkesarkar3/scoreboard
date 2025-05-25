import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Group } from '../../models/group.model';
import { GroupService } from '../../services/group.service';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="group-list-container">
      <div class="header">
        <h2>Groups</h2>
        <button class="add-button" routerLink="/groups/add">Add Group</button>
      </div>

      <table class="group-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tournament</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let group of groups">
            <td>{{ group.id }}</td>
            <td>{{ group.name }}</td>
            <td>{{ getTournamentName(group.tournamentId) }}</td>
            <td class="actions">
              <button class="edit-button" (click)="onEdit(group)">Edit</button>
              <button class="delete-button" (click)="onDelete(group.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .group-list-container {
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

    .group-table {
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
export class GroupListComponent implements OnInit {
  groups: Group[] = [];

  constructor(
    private groupService: GroupService,
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupService.groups$.subscribe(groups => {
      this.groups = groups;
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

  onEdit(group: Group): void {
    this.router.navigate(['/groups/edit', group.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id);
    }
  }
}