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
            #toss_decision="ngModel"
          >
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class MatchSetupComponent implements OnInit {
  match: Match = {
    id: '',
    team1_id: '',
    team2_id: '',
    tournament_id: '',
    stadium_id: '',
    scheduled_at: new Date(),
    total_overs: 20,
    toss_winner_id: '',
    toss_decision: 'bat',
    status: 'scheduled'
  };

  teams: Team[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
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

  onSubmit(): void {
    this.match.status = 'in_progress';
    this.matchService.updateMatch(this.match);
    this.router.navigate(['/matches', this.match.id, 'scoring']);
  }

  onCancel(): void {
    this.router.navigate(['/matches']);
  }
}