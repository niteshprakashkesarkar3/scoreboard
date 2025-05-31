import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Player } from '../../models/player.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { SelectComponent } from '../shared/select/select.component';

interface MatchSetup extends Match {
  striker_id?: string;
  non_striker_id?: string;
  opening_bowler_id?: string;
}

@Component({
  selector: 'app-match-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormLayoutComponent,
    FormFieldComponent,
    SelectComponent
  ],
  template: `
    <form #setupForm="ngForm">
      <app-form-layout
        itemName="Match Setup"
        [submitDisabled]="!setupForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="total_overs"
          label="Total Overs"
          [showError]="!!(total_overs.invalid && (total_overs.dirty || total_overs.touched))"
          errorMessage="Total overs is required"
        >
          <app-select
            id="total_overs"
            name="total_overs"
            [(ngModel)]="match.total_overs"
            [required]="true"
            placeholder="Select Total Overs"
            #total_overs="ngModel"
          >
            <option value="5">5 Overs</option>
            <option value="10">10 Overs</option>
            <option value="20">20 Overs (T20)</option>
            <option value="50">50 Overs (ODI)</option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="toss_winner"
          label="Toss Winner"
          [showError]="!!(toss_winner.invalid && (toss_winner.dirty || toss_winner.touched))"
          errorMessage="Toss winner is required"
        >
          <app-select
            id="toss_winner"
            name="toss_winner"
            [(ngModel)]="match.toss_winner_id"
            [required]="true"
            placeholder="Select Toss Winner"
            (ngModelChange)="onTossWinnerChange()"
            #toss_winner="ngModel"
          >
            <option [value]="match.team1_id">{{ getTeamName(match.team1_id) }}</option>
            <option [value]="match.team2_id">{{ getTeamName(match.team2_id) }}</option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="toss_decision"
          label="Toss Decision"
          [showError]="!!(toss_decision.invalid && (toss_decision.dirty || toss_decision.touched))"
          errorMessage="Toss decision is required"
        >
          <app-select
            id="toss_decision"
            name="toss_decision"
            [(ngModel)]="match.toss_decision"
            [required]="true"
            placeholder="Select Decision"
            (ngModelChange)="onTossDecisionChange()"
            #toss_decision="ngModel"
          >
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="striker"
          label="Striker"
          [showError]="!!(striker.invalid && (striker.dirty || striker.touched))"
          errorMessage="Striker is required"
        >
          <app-select
            id="striker"
            name="striker"
            [(ngModel)]="match.striker_id"
            [required]="true"
            placeholder="Select Striker"
            #striker="ngModel"
          >
            <option *ngFor="let player of battingTeamPlayers" [value]="player.id">
              {{ player.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="non_striker"
          label="Non-Striker"
          [showError]="!!(non_striker.invalid && (non_striker.dirty || non_striker.touched))"
          errorMessage="Non-striker is required"
        >
          <app-select
            id="non_striker"
            name="non_striker"
            [(ngModel)]="match.non_striker_id"
            [required]="true"
            placeholder="Select Non-Striker"
            #non_striker="ngModel"
          >
            <option *ngFor="let player of battingTeamPlayers" [value]="player.id">
              {{ player.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="opening_bowler"
          label="Opening Bowler"
          [showError]="!!(opening_bowler.invalid && (opening_bowler.dirty || opening_bowler.touched))"
          errorMessage="Opening bowler is required"
        >
          <app-select
            id="opening_bowler"
            name="opening_bowler"
            [(ngModel)]="match.opening_bowler_id"
            [required]="true"
            placeholder="Select Opening Bowler"
            #opening_bowler="ngModel"
          >
            <option *ngFor="let player of bowlingTeamPlayers" [value]="player.id">
              {{ player.name }}
            </option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class MatchSetupComponent implements OnInit {
  match: MatchSetup = {
    id: '',
    team1_id: '',
    team2_id: '',
    tournament_id: '',
    stadium_id: '',
    scheduled_at: new Date(),
    total_overs: 20,
    toss_winner_id: '',
    toss_decision: 'bat',
    status: 'scheduled',
    striker_id: '',
    non_striker_id: '',
    opening_bowler_id: ''
  };

  teams: Team[] = [];
  battingTeamPlayers: Player[] = [];
  bowlingTeamPlayers: Player[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchService.matches$.subscribe(matches => {
        const match = matches.find(m => m.id === id);
        if (match) {
          this.match = { ...match };
          if (this.match.toss_winner_id) {
            this.onTossWinnerChange();
          }
        } else {
          this.router.navigate(['/matches']);
        }
      });
    }

    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });
  }

  getTeamName(id: string): string {
    const team = this.teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
  }

  onTossWinnerChange(): void {
    if (this.match.toss_winner_id) {
      this.onTossDecisionChange();
    }
  }

  onTossDecisionChange(): void {
    if (!this.match.toss_winner_id || !this.match.toss_decision) return;

    const battingTeamId = this.match.toss_decision === 'bat' 
      ? this.match.toss_winner_id 
      : (this.match.toss_winner_id === this.match.team1_id ? this.match.team2_id : this.match.team1_id);

    const bowlingTeamId = battingTeamId === this.match.team1_id 
      ? this.match.team2_id 
      : this.match.team1_id;

    // Reset player selections
    this.match.striker_id = '';
    this.match.non_striker_id = '';
    this.match.opening_bowler_id = '';

    // Load batting team players
    this.battingTeamPlayers = this.playerService.getPlayersByTeam(battingTeamId)
      .filter(p => p.status === 'playing' && 
        (p.roles.includes('Batsman') || p.roles.includes('All Rounder') || p.roles.includes('Wicket Keeper')));

    // Load bowling team players
    this.bowlingTeamPlayers = this.playerService.getPlayersByTeam(bowlingTeamId)
      .filter(p => p.status === 'playing' && 
        (p.roles.includes('Bowler') || p.roles.includes('All Rounder')));
  }

  onSubmit(): void {
    // Convert total_overs to number
    this.match.total_overs = Number(this.match.total_overs);
    // Update match status to in_progress
    this.match.status = 'in_progress';
    
    // Store the match setup data in localStorage for use in innings scoring
    localStorage.setItem('match_setup_' + this.match.id, JSON.stringify({
      striker_id: this.match.striker_id,
      non_striker_id: this.match.non_striker_id,
      opening_bowler_id: this.match.opening_bowler_id
    }));
    
    this.matchService.updateMatch(this.match);
    this.router.navigate(['/matches', this.match.id, 'scoring']);
  }

  onCancel(): void {
    this.router.navigate(['/matches']);
  }
}