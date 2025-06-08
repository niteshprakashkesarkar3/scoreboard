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
import { BallService } from '../../services/ball.service';
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
          <span *ngIf="match.toss_winner_id">
            Toss: {{ getTeamName(match.toss_winner_id) }} chose to {{ match.toss_decision }}
          </span>
        </p>
        <div class="match-actions-header">
          <app-button 
            variant="secondary" 
            (onClick)="viewStatistics()"
            *ngIf="matchInnings.length > 0"
          >
            View Statistics
          </app-button>
        </div>
      </div>

      <!-- Match Results (when completed) -->
      <div class="match-results" *ngIf="match.status === 'completed' && matchInnings.length === 2">
        <h3>Match Result</h3>
        <div class="result-summary">
          <div class="team-score">
            <h4>{{ getTeamName(matchInnings[0].batting_team_id) }}</h4>
            <span class="score">{{ matchInnings[0].total_runs }}/{{ matchInnings[0].wickets }}</span>
            <span class="overs">({{ matchInnings[0].overs | number:'1.1-1' }} ov)</span>
          </div>
          <div class="vs">vs</div>
          <div class="team-score">
            <h4>{{ getTeamName(matchInnings[1].batting_team_id) }}</h4>
            <span class="score">{{ matchInnings[1].total_runs }}/{{ matchInnings[1].wickets }}</span>
            <span class="overs">({{ matchInnings[1].overs | number:'1.1-1' }} ov)</span>
          </div>
        </div>
        <div class="winner-announcement">
          <h3>{{ getMatchWinner() }}</h3>
        </div>
      </div>

      <div class="innings-cards"> 
        <div class="innings-card" *ngFor="let innings of matchInnings">
          <div class="innings-header">
            <h3>{{ getTeamName(innings.batting_team_id) }} {{ getInningsLabel(innings) }}</h3>
            <span class="score">
              {{ innings.total_runs }}/{{ innings.wickets }}
              ({{ innings.overs | number:'1.1-1' }} ov)
            </span>
          </div>
          <div class="innings-status">
            <span class="status-badge" [class]="innings.status">
              {{ innings.status | titlecase }}
            </span>
          </div>
          <div class="innings-actions" *ngIf="match.status !== 'completed'">
            <app-button 
              variant="primary" 
              (onClick)="continueInnings(innings)"
              *ngIf="innings.status === 'in_progress'"
            >
              Continue Scoring
            </app-button>
            <app-button
              variant="danger"
              (onClick)="clearInnings(innings)"
            >
              Clear Innings
            </app-button>
          </div>
        </div>
      </div>

      <div class="match-actions" *ngIf="!hasInProgressInnings && match.status !== 'completed'">
        <app-button
          variant="primary"
          (onClick)="startNewInnings()"
          *ngIf="matchInnings.length < 2"
        >
          Start {{ matchInnings.length === 0 ? 'First' : 'Second' }} Innings
        </app-button>
      </div>

      <div class="completed-match-actions" *ngIf="match.status === 'completed'">
        <app-button
          variant="secondary"
          (onClick)="goBackToMatches()"
        >
          Back to Matches
        </app-button>
        <app-button
          variant="danger"
          (onClick)="resetMatch()"
        >
          Reset Match
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
      position: relative;
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

    .match-actions-header {
      position: absolute;
      top: 0;
      right: 0;
    }

    .match-results {
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
      border-radius: 8px;
      border: 2px solid #4caf50;
    }

    .match-results h3 {
      text-align: center;
      color: #1B5E20;
      margin-bottom: 1.5rem;
    }

    .result-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .team-score {
      text-align: center;
      flex: 1;
    }

    .team-score h4 {
      margin: 0 0 0.5rem;
      color: #1B5E20;
    }

    .team-score .score {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .team-score .overs {
      display: block;
      color: #666;
      margin-top: 0.25rem;
    }

    .vs {
      font-size: 1.25rem;
      font-weight: bold;
      color: #666;
      margin: 0 1rem;
    }

    .winner-announcement {
      text-align: center;
      padding: 1rem;
      background: #4caf50;
      color: white;
      border-radius: 4px;
    }

    .winner-announcement h3 {
      margin: 0;
      color: white;
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

    .innings-status {
      margin-bottom: 1rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      text-transform: capitalize;
    }

    .status-badge.not_started {
      background-color: #f5f5f5;
      color: #666;
    }

    .status-badge.in_progress {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.completed {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .innings-actions {
      display: flex;
      gap: 1rem;
    }

    .match-actions,
    .completed-match-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .match-scoring-container {
        padding: 1rem;
      }

      .match-header {
        position: relative;
      }

      .match-actions-header {
        position: static;
        margin-top: 1rem;
      }

      .innings-cards {
        flex-direction: column;
      }

      .innings-actions {
        flex-direction: column;
      }

      .result-summary {
        flex-direction: column;
        gap: 1rem;
      }

      .vs {
        margin: 0;
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
    private ballService: BallService,
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

  getInningsLabel(innings: Innings): string {
    return innings.id.endsWith('_1st') ? '(1st Innings)' : '(2nd Innings)';
  }

  getMatchWinner(): string {
    if (this.matchInnings.length !== 2) return '';
    
    const firstInnings = this.matchInnings.find(i => i.id.endsWith('_1st'));
    const secondInnings = this.matchInnings.find(i => i.id.endsWith('_2nd'));
    
    if (!firstInnings || !secondInnings) return '';

    const team1Score = firstInnings.total_runs;
    const team2Score = secondInnings.total_runs;
    
    if (team2Score > team1Score) {
      const wicketsRemaining = 10 - secondInnings.wickets;
      const ballsRemaining = (this.match.total_overs! * 6) - (Math.floor(secondInnings.overs) * 6 + Math.round((secondInnings.overs % 1) * 6));
      return `${this.getTeamName(secondInnings.batting_team_id)} won by ${wicketsRemaining} wickets (${ballsRemaining} balls remaining)`;
    } else {
      const runsMargin = team1Score - team2Score;
      return `${this.getTeamName(firstInnings.batting_team_id)} won by ${runsMargin} runs`;
    }
  }

  get hasInProgressInnings(): boolean {
    return this.matchInnings.some(i => i.status === 'in_progress');
  }

  continueInnings(innings: Innings): void {
    this.router.navigate(['/matches', this.match.id, 'innings', innings.id]);
  }

  clearInnings(innings: Innings): void {
    if (confirm('Are you sure you want to clear this innings? All scoring data will be lost.')) {
      // Clear all balls for this innings
      const balls = this.ballService.getBallsByInnings(innings.id);
      balls.forEach(ball => {
        this.ballService.deleteBall(ball.id);
      });

      // Remove the innings
      this.inningsService.deleteInnings(innings.id);

      // If this was the only innings, reset match status
      if (this.matchInnings.length === 1) {
        this.match.status = 'scheduled';
        this.match.toss_winner_id = '';
        this.match.toss_decision = 'bat';
        this.matchService.updateMatch(this.match);
        this.router.navigate(['/matches', this.match.id, 'setup']);
      } else {
        this.loadInnings();
      }
    }
  }

  startNewInnings(): void {
    const isFirstInnings = this.matchInnings.length === 0;
    const battingTeamId = isFirstInnings
      ? (this.match.toss_decision === 'bat' 
          ? (this.match.toss_winner_id ?? '') 
          : this.getOtherTeamId(this.match.toss_winner_id ?? ''))
      : this.getOtherTeamId(this.matchInnings[0]?.batting_team_id ?? '');

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

  viewStatistics(): void {
    this.router.navigate(['/matches', this.match.id, 'statistics']);
  }

  goBackToMatches(): void {
    this.router.navigate(['/matches']);
  }

  resetMatch(): void {
    if (confirm('Are you sure you want to reset this entire match? All data will be lost.')) {
      // Clear all innings and balls
      this.matchInnings.forEach(innings => {
        const balls = this.ballService.getBallsByInnings(innings.id);
        balls.forEach(ball => {
          this.ballService.deleteBall(ball.id);
        });
        this.inningsService.deleteInnings(innings.id);
      });

      // Reset match status
      this.match.status = 'scheduled';
      this.match.toss_winner_id = '';
      this.match.toss_decision = 'bat';
      this.matchService.updateMatch(this.match);

      // Navigate to match setup
      this.router.navigate(['/matches', this.match.id, 'setup']);
    }
  }
}