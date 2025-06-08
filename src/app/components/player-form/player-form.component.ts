import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FormLayoutComponent, 
    FormFieldComponent,
    InputComponent,
    SelectComponent
  ],
  template: `
    <form #playerForm="ngForm">
      <app-form-layout
        itemName="Player"
        [isEditMode]="isEditMode"
        [submitDisabled]="!playerForm.form.valid || player.roles.length === 0"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Player ID"
          [showError]="false"
          errorMessage=""
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="player.id"
            [readonly]="true"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="name"
          label="Player Name"
          [showError]="!!(name.invalid && (name.dirty || name.touched))"
          errorMessage="Player name is required"
        >
          <app-input
            id="name"
            name="name"
            [(ngModel)]="player.name"
            [required]="true"
            #name="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="teamId"
          label="Team"
          [showError]="!!(teamId.invalid && (teamId.dirty || teamId.touched))"
          errorMessage="Team is required"
        >
          <app-select
            id="teamId"
            name="teamId"
            [(ngModel)]="player.teamId"
            [required]="true"
            placeholder="Select Team"
            #teamId="ngModel"
          >
            <option *ngFor="let team of teams" [value]="team.id">
              {{ team.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="roles"
          label="Roles"
          [showError]="player.roles.length === 0"
          errorMessage="At least one role must be selected"
        >
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
        </app-form-field>

        <app-form-field
          id="status"
          label="Status"
          [showError]="!!(status.invalid && (status.dirty || status.touched))"
          errorMessage="Status is required"
        >
          <app-select
            id="status"
            name="status"
            [(ngModel)]="player.status"
            [required]="true"
            placeholder="Select Status"
            #status="ngModel"
          >
            <option value="playing">Playing</option>
            <option value="injured">Injured</option>
            <option value="not playing">Not Playing</option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `,
  styles: [`
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
  `]
})
export class PlayerFormComponent implements OnInit {
  @ViewChild('playerForm') playerForm!: NgForm;

  player: Player = {
    id: Date.now().toString(),
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
    if (this.playerForm.valid && this.player.roles.length > 0) {
      if (this.isEditMode) {
        this.playerService.updatePlayer(this.player);
      } else {
        this.playerService.addPlayer(this.player);
      }
      this.router.navigate(['/players']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/players']);
  }
}