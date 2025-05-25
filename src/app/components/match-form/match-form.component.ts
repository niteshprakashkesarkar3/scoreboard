import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Stadium } from '../../models/stadium.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { StadiumService } from '../../services/stadium.service';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="match-form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Match</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Match ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="match.id" 
            required
            [readonly]="isEditMode"
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Match ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="tournament_id">Tournament</label>
          <select 
            id="tournament_id" 
            name="tournament_id" 
            [(ngModel)]="match.tournament_id" 
            required
            (ngModelChange)="onTournamentChange()"
            #tournament_id="ngModel">
            <option value="">Select Tournament</option>
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
          <div class="error" *ngIf="tournament_id.invalid && (tournament_id.dirty || tournament_id.touched)">
            Tournament is required
          </div>
        </div>

        <div class="form-group">
          <label for="team1_id">Team 1</label>
          <select 
            id="team1_id" 
            name="team1_id" 
            [(ngModel)]="match.team1_id" 
            required
            #team1_id="ngModel">
            <option value="">Select Team 1</option>
            <option *ngFor="let team of availableTeams" [value]="team.id">
              {{ team.name }}
            </option>
          </select>
          <div class="error" *ngIf="team1_id.invalid && (team1_id.dirty || team1_id.touched)">
            Team 1 is required
          </div>
        </div>

        <div class="form-group">
          <label for="team2_id">Team 2</label>
          <select 
            id="team2_id" 
            name="team2_id" 
            [(ngModel)]="match.team2_id" 
            required
            #team2_id="ngModel">
            <option value="">Select Team 2</option>
            <option *ngFor="let team of availableTeams" [value]="team.id">
              {{ team.name }}
            </option>
          </select>
          <div class="error" *ngIf="team2_id.invalid && (team2_id.dirty || team2_id.touched)">
            Team 2 is required
          </div>
        </div>

        <div class="form-group">
          <label for="stadium_id">Stadium</label>
          <select 
            id="stadium_id" 
            name="stadium_id" 
            [(ngModel)]="match.stadium_id" 
            required
            #stadium_id="ngModel">
            <option value="">Select Stadium</option>
            <option *ngFor="let stadium of stadiums" [value]="stadium.id">
              {{ stadium.name }}
            </option>
          </select>
          <div class="error" *ngIf="stadium_id.invalid && (stadium_id.dirty || stadium_id.touched)">
            Stadium is required
          </div>
        </div>

        <div class="form-group">
          <label for="scheduled_at">Scheduled At</label>
          <input 
            type="datetime-local" 
            id="scheduled_at" 
            name="scheduled_at" 
            [ngModel]="match.scheduled_at | date:'yyyy-MM-ddTHH:mm'"
            (ngModelChange)="match.scheduled_at = $event"
            required
            #scheduled_at="ngModel">
          <div class="error" *ngIf="scheduled_at.invalid && (scheduled_at.dirty || scheduled_at.touched)">
            Schedule date and time is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">{{ isEditMode ? 'Update' : 'Save' }} Match</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .match-form-container {
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
export class MatchFormComponent implements OnInit {
  match: Match = {
    id: '',
    team1_id: '',
    team2_id: '',
    tournament_id: '',
    stadium_id: '',
    scheduled_at: new Date()
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
          this.match = { ...match };
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

  getTeamName(teamId: string): string {
    const team = this.availableTeams.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.matchService.updateMatch(this.match);
    } else {
      this.matchService.addMatch(this.match);
    }
    this.router.navigate(['/matches']);
  }

  onCancel(): void {
    this.router.navigate(['/matches']);
  }
}