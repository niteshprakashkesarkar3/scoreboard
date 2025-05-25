import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Group } from '../../models/group.model';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="team-form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Team</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Team ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="team.id" 
            required
            [readonly]="isEditMode"
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Team ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="name">Team Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="team.name" 
            required
            #name="ngModel">
          <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
            Team name is required
          </div>
        </div>

        <div class="form-group">
          <label for="tournamentId">Tournament</label>
          <select 
            id="tournamentId" 
            name="tournamentId" 
            [(ngModel)]="team.tournamentId" 
            required
            (ngModelChange)="onTournamentChange()"
            #tournamentId="ngModel">
            <option value="">Select Tournament</option>
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
          <div class="error" *ngIf="tournamentId.invalid && (tournamentId.dirty || tournamentId.touched)">
            Tournament is required
          </div>
        </div>

        <div class="form-group">
          <label for="groupId">Group</label>
          <select 
            id="groupId" 
            name="groupId" 
            [(ngModel)]="team.groupId" 
            required
            #groupId="ngModel">
            <option value="">Select Group</option>
            <option *ngFor="let group of availableGroups" [value]="group.id">
              {{ group.name }}
            </option>
          </select>
          <div class="error" *ngIf="groupId.invalid && (groupId.dirty || groupId.touched)">
            Group is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">{{ isEditMode ? 'Update' : 'Save' }} Team</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .team-form-container {
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

    input[readonly] {
      background-color: #f5f5f5;
      cursor: not-allowed;
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
export class TeamFormComponent implements OnInit {
  team: Team = {
    id: '',
    name: '',
    tournamentId: '',
    groupId: ''
  };

  tournaments: Tournament[] = [];
  availableGroups: Group[] = [];
  isEditMode = false;

  constructor(
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tournamentService.tournaments$.subscribe(tournaments => {
      this.tournaments = tournaments;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.teamService.teams$.subscribe(teams => {
        const team = teams.find(t => t.id === id);
        if (team) {
          this.team = { ...team };
          this.onTournamentChange();
        } else {
          this.router.navigate(['/teams']);
        }
      });
    }
  }

  onTournamentChange(): void {
    if (this.team.tournamentId) {
      this.groupService.getGroupsByTournament(this.team.tournamentId).subscribe(groups => {
        this.availableGroups = groups;
        if (!this.isEditMode) {
          this.team.groupId = '';
        }
      });
    } else {
      this.availableGroups = [];
      this.team.groupId = '';
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.teamService.updateTeam(this.team);
    } else {
      this.teamService.addTeam(this.team);
    }
    this.router.navigate(['/teams']);
  }

  onCancel(): void {
    this.router.navigate(['/teams']);
  }
}