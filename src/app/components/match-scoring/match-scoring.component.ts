import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Innings } from '../../models/innings.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { InningsService } from '../../services/innings.service';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-match-scoring',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  template: `
    <div class="match-scoring-container">
      <div class="match-header">
        <h2>{{ getTeamName(match.team1_id) }} vs {{ getTeamName(match.team2_id) }}</h2>
        <p class="match-info">
          {{ match.total_overs ?? 20 }} Overs Match
          <span class="separator">|</span>
          Toss: {{ getTeamName(match.toss_winner_id ?? '') }} chose to {{ match.toss_decision }}
        </p>
      </div>

      <div class="innings-cards">
        <div class="innings-card" *ngFor="let innings of matchInnings">
          <div class="innings-header">
            <h3>{{ getTeamName(innings.batting_team_id) }}</h3>
            <span class="score">
              {{ innings.total_runs }}/{{ innings.wickets }}
              ({{ innings.overs }} ov)
            </span>
          </div>
          <a [routerLink]="['/matches', match.id, 'innings', innings.id]" *ngIf="innings.status === 'in_progress'">
            <app-button variant="primary">
              Continue Scoring
            </app-button>
          </a>
        </div>
      </div>

      <div class="match-actions" *ngIf="!hasInProgressInnings">
        <app-button
          variant="primary"
          (onClick)="startNewInnings()"
          *ngIf="matchInnings.length < 2"
        >
          Start {{ matchInnings.length === 0 ? 'First' : 'Second' }} Innings
        </app-button>
        <app-button
          variant="secondary"
          (onClick)="endMatch()"
          *ngIf="matchInnings.length === 2"
        >
          End Match
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .match-scoring-container {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .match-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .match-header h2 {
      margin: 0;
      color: #1B5E20;
    }

    .match-info {
      color: #666;
      margin: 0.5rem 0 0;
    }

    .separator {
      margin: 0 0.5rem;
    }

    .innings-cards {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .innings-card {
      flex: 1;
      padding: 1.5rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .innings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .innings-header h3 {
      margin: 0;
      color: #1B5E20;
    }

    .score {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .match-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .match-scoring-container {
        padding: 1rem;
      }

      .innings-cards {
        flex-direction: column;
      }
    }
  `]
})
export class MatchScoringComponent implements OnInit {
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
  matchInnings: Innings[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private inningsService: InningsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchService.matches$.subscribe(matches => {
        const match = matches.find(m => m.id === id);
        if (match) {
          this.match = match;
          this.loadInnings();
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

  loadInnings(): void {
    this.matchInnings = this.inningsService.getInningsByMatch(this.match.id);
  }

  get hasInProgressInnings(): boolean {
    return this.matchInnings.some(i => i.status === 'in_progress');
  }

  startNewInnings(): void {
    const isFirstInnings = this.matchInnings.length === 0;
    const battingTeamId = isFirstInnings
      ? (this.match.toss_decision === 'bat' ? this.match.toss_winner_id : this.getOtherTeamId(this.match.toss_winner_id ?? ''))
      : this.getOtherTeamId(this.matchInnings[0].batting_team_id);

    const bowlingTeamId = this.getOtherTeamId(battingTeamId);

    const innings: Innings = {
      id: `${this.match.id}_${isFirstInnings ? '1st' : '2nd'}`,
      match_id: this.match.id,
      batting_team_id: battingTeamId,
      bowling_team_id: bowlingTeamId,
      total_runs: 0,
      wickets: 0,
      overs: 0,
      extras: {
        wides: 0,
        no_balls: 0,
        byes: 0,
        leg_byes: 0
      },
      status: 'in_progress'
    };

    this.inningsService.addInnings(innings);
    this.router.navigate(['/matches', this.match.id, 'innings', innings.id]);
  }

  getOtherTeamId(teamId: string): string {
    return teamId === this.match.team1_id ? this.match.team2_id : this.match.team1_id;
  }

  endMatch(): void {
    this.match.status = 'completed';
    this.matchService.updateMatch(this.match);
    this.router.navigate(['/matches']);
  }
}