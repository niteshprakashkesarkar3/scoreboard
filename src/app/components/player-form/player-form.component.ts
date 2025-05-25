import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="player-form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Player</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Player ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="player.id" 
            required
            [readonly]="isEditMode"
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Player ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="name">Player Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="player.name" 
            required
            #name="ngModel">
          <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
            Player name is required
          </div>
        </div>

        <div class="form-group">
          <label for="teamId">Team</label>
          <select 
            id="teamId" 
            name="teamId" 
            [(ngModel)]="player.teamId" 
            required
            #teamId="ngModel">
            <option value="">Select Team</option>
            <option *ngFor="let team of teams" [value]="team.id">
              {{ team.name }}
            </option>
          </select>
          <div class="error" *ngIf="teamId.invalid && (teamId.dirty || teamId.touched)">
            Team is required
          </div>
        </div>

        <div class="form-group">
          <label>Roles</label>
          <div class="checkbox-group">
            <label *ngFor="let role of availableRoles" class="checkbox-label">
              <input 
                type="checkbox"
                [value]="role"
                (change)="onRoleChange($event)"
                [checked]="player.roles.includes(role)">
              {{ role }}
            </label>
          </div>
          <div class="error" *ngIf="player.roles.length === 0">
            At least one role must be selected
          </div>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select 
            id="status" 
            name="status" 
            [(ngModel)]="player.status" 
            required
            #status="ngModel">
            <option value="playing">Playing</option>
            <option value="injured">Injured</option>
            <option value="not playing">Not Playing</option>
          </select>
          <div class="error" *ngIf="status.invalid && (status.dirty || status.touched)">
            Status is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || player.roles.length === 0">
            {{ isEditMode ? 'Update' : 'Save' }} Player
          </button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .player-form-container {
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

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
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
export class PlayerFormComponent implements OnInit {
  player: Player = {
    id: '',
    name: '',
    roles: [],
    status: 'playing',
    teamId: ''
  };

  teams: Team[] = [];
  isEditMode = false;

  availableRoles: ('All Rounder' | 'Batsman' | 'Bowler' | 'Wicket Keeper')[] = [
    'All Rounder',
    'Batsman',
    'Bowler',
    'Wicket Keeper'
  ];

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.playerService.players$.subscribe(players => {
        const player = players.find(p => p.id === id);
        if (player) {
          this.player = { ...player };
        } else {
          this.router.navigate(['/players']);
        }
      });
    }
  }

  onRoleChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const role = checkbox.value as 'All Rounder' | 'Batsman' | 'Bowler' | 'Wicket Keeper';
    
    if (checkbox.checked) {
      this.player.roles.push(role);
    } else {
      this.player.roles = this.player.roles.filter(r => r !== role);
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.playerService.updatePlayer(this.player);
    } else {
      this.playerService.addPlayer(this.player);
    }
    this.router.navigate(['/players']);
  }

  onCancel(): void {
    this.router.navigate(['/players']);
  }
}