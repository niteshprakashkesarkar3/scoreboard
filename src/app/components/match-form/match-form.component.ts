import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Stadium } from '../../models/stadium.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { StadiumService } from '../../services/stadium.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-match-form',
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
    <form #matchForm="ngForm">
      <app-form-layout
        itemName="Match"
        [isEditMode]="isEditMode"
        [submitDisabled]="!matchForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Match ID"
          [showError]="!!(id.invalid && (id.dirty || id.touched))"
          errorMessage="Match ID is required"
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="match.id"
            [required]="true"
            [readonly]="isEditMode"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="tournament_id"
          label="Tournament"
          [showError]="!!(tournament_id.invalid && (tournament_id.dirty || tournament_id.touched))"
          errorMessage="Tournament is required"
        >
          <app-select
            id="tournament_id"
            name="tournament_id"
            [(ngModel)]="match.tournament_id"
            [required]="true"
            placeholder="Select Tournament"
            (ngModelChange)="onTournamentChange()"
            #tournament_id="ngModel"
          >
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="team1_id"
          label="Team 1"
          [showError]="!!(team1_id.invalid && (team1_id.dirty || team1_id.touched))"
          errorMessage="Team 1 is required"
        >
          <app-select
            id="team1_id"
            name="team1_id"
            [(ngModel)]="match.team1_id"
            [required]="true"
            placeholder="Select Team 1"
            #team1_id="ngModel"
          >
            <option *ngFor="let team of availableTeams" [value]="team.id">
              {{ team.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="team2_id"
          label="Team 2"
          [showError]="!!(team2_id.invalid && (team2_id.dirty || team2_id.touched))"
          errorMessage="Team 2 is required"
        >
          <app-select
            id="team2_id"
            name="team2_id"
            [(ngModel)]="match.team2_id"
            [required]="true"
            placeholder="Select Team 2"
            #team2_id="ngModel"
          >
            <option *ngFor="let team of availableTeams" [value]="team.id">
              {{ team.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="stadium_id"
          label="Stadium"
          [showError]="!!(stadium_id.invalid && (stadium_id.dirty || stadium_id.touched))"
          errorMessage="Stadium is required"
        >
          <app-select
            id="stadium_id"
            name="stadium_id"
            [(ngModel)]="match.stadium_id"
            [required]="true"
            placeholder="Select Stadium"
            #stadium_id="ngModel"
          >
            <option *ngFor="let stadium of stadiums" [value]="stadium.id">
              {{ stadium.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="scheduled_at"
          label="Scheduled At"
          [showError]="!!(scheduled_at.invalid && (scheduled_at.dirty || scheduled_at.touched))"
          errorMessage="Schedule date and time is required"
        >
          <app-input
            type="datetime-local"
            id="scheduled_at"
            name="scheduled_at"
            [(ngModel)]="match.scheduled_at"
            [required]="true"
            #scheduled_at="ngModel"
          ></app-input>
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
            [(ngModel)]="match.status"
            [required]="true"
            placeholder="Select Status"
            #status="ngModel"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class MatchFormComponent implements OnInit {
  @ViewChild('matchForm') matchForm!: NgForm;

  match: Match = {
    id: '',
    team1_id: '',
    team2_id: '',
    tournament_id: '',
    stadium_id: '',
    scheduled_at: new Date().toISOString().slice(0, 16),
    status: 'scheduled'
  };

  tournaments: Tournament[] = [];
  stadiums: Stadium[] = [];
  availableTeams: Team[] = [];
  isEditMode = false;

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private stadiumService: StadiumService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tournamentService.tournaments$.subscribe(tournaments => {
      this.tournaments = tournaments;
    });

    this.stadiumService.stadiums$.subscribe(stadiums => {
      this.stadiums = stadiums;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.matchService.matches$.subscribe(matches => {
        const match = matches.find(m => m.id === id);
        if (match) {
          // Convert date to local datetime-local format
          const date = new Date(match.scheduled_at);
          const scheduled_at = date.toISOString().slice(0, 16);
          
          this.match = { 
            ...match,
            scheduled_at
          };
          this.onTournamentChange();
        } else {
          this.router.navigate(['/matches']);
        }
      });
    }
  }

  onTournamentChange(): void {
    if (this.match.tournament_id) {
      this.teamService.getTeamsByTournament(this.match.tournament_id).subscribe(teams => {
        this.availableTeams = teams;
        if (!this.isEditMode) {
          this.match.team1_id = '';
          this.match.team2_id = '';
        }
      });
    } else {
      this.availableTeams = [];
      this.match.team1_id = '';
      this.match.team2_id = '';
    }
  }

  onSubmit(): void {
    if (this.matchForm.valid) {
      // Convert datetime-local string back to Date object
      const match = {
        ...this.match,
        scheduled_at: new Date(this.match.scheduled_at)
      };

      if (this.isEditMode) {
        this.matchService.updateMatch(match);
      } else {
        this.matchService.addMatch(match);
      }
      this.router.navigate(['/matches']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/matches']);
  }
}