import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Innings } from '../../models/innings.model';
import { Ball, BallOutcome } from '../../models/ball.model';
import { Player } from '../../models/player.model';
import { InningsService } from '../../services/innings.service';
import { BallService } from '../../services/ball.service';
import { PlayerService } from '../../services/player.service';
import { ButtonComponent } from '../shared/button/button.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-innings-scoring',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelectComponent],
  template: `
    <div class="innings-scoring-container">
      <div class="scoring-header">
        <h2>{{ getBattingTeamName() }} Innings</h2>
        <div class="score-summary">
          <span class="total-score">{{ innings.total_runs }}/{{ innings.wickets }}</span>
          <span class="overs">{{ innings.overs }} overs</span>
        </div>
      </div>

      <div class="current-over">
        <h3>Over {{ currentOver }}</h3>
        <div class="balls-container">
          <div *ngFor="let ball of currentOverBalls" class="ball">
            {{ getBallDisplay(ball) }}
          </div>
        </div>
      </div>

      <div class="scoring-controls">
        <div class="batsman-bowler">
          <div class="player-select">
            <label>Batsman</label>
            <app-select
              [(ngModel)]="currentBatsman"
              [required]="true"
              placeholder="Select Batsman"
            >
              <option *ngFor="let player of availableBatsmen" [value]="player.id">
                {{ player.name }}
              </option>
            </app-select>
          </div>

          <div class="player-select">
            <label>Bowler</label>
            <app-select
              [(ngModel)]="currentBowler"
              [required]="true"
              placeholder="Select Bowler"
            >
              <option *ngFor="let player of availableBowlers" [value]="player.id">
                {{ player.name }}
              </option>
            </app-select>
          </div>
        </div>

        <div class="runs-buttons">
          <app-button
            *ngFor="let run of [0, 1, 2, 3, 4, 6]"
            variant="primary"
            (onClick)="addRuns(run)"
          >
            {{ run }}
          </app-button>
        </div>

        <div class="extras-buttons">
          <app-button variant="secondary" (onClick)="addExtra('wide')">Wide</app-button>
          <app-button variant="secondary" (onClick)="addExtra('no_ball')">No Ball</app-button>
          <app-button variant="secondary" (onClick)="addExtra('bye')">Bye</app-button>
          <app-button variant="secondary" (onClick)="addExtra('leg_bye')">Leg Bye</app-button>
        </div>

        <div class="wicket-controls">
          <app-button variant="danger" (onClick)="showWicketDialog()">Wicket</app-button>
        </div>

        <div class="action-buttons">
          <app-button variant="secondary" (onClick)="undoLastBall()">Undo</app-button>
          <app-button 
            variant="primary" 
            (onClick)="endOver()"
            [disabled]="currentOverBalls.length < 6"
          >
            End Over
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .innings-scoring-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .scoring-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .score-summary {
      text-align: right;
    }

    .total-score {
      font-size: 2rem;
      font-weight: bold;
      color: #1B5E20;
    }

    .overs {
      font-size: 1.25rem;
      color: #666;
      margin-left: 1rem;
    }

    .current-over {
      margin-bottom: 2rem;
    }

    .balls-container {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .ball {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .scoring-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .batsman-bowler {
      display: flex;
      gap: 1rem;
    }

    .player-select {
      flex: 1;
    }

    .player-select label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .runs-buttons {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
    }

    .extras-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .innings-scoring-container {
        padding: 1rem;
      }

      .batsman-bowler {
        flex-direction: column;
      }

      .runs-buttons,
      .extras-buttons {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class InningsScoringComponent implements OnInit {
  innings!: Innings;
  currentOver = 0;
  currentOverBalls: Ball[] = [];
  currentBatsman = '';
  currentBowler = '';
  availableBatsmen: Player[] = [];
  availableBowlers: Player[] = [];

  constructor(
    private inningsService: InningsService,
    private ballService: BallService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const inningsId = this.route.snapshot.paramMap.get('inningsId');
    if (inningsId) {
      const innings = this.inningsService.getInningsByMatch(inningsId)[0];
      if (innings) {
        this.innings = innings;
        this.loadCurrentOver();
        this.loadPlayers();
      } else {
        this.router.navigate(['/matches']);
      }
    }
  }

  private loadCurrentOver(): void {
    const balls = this.ballService.getBallsByInnings(this.innings.id);
    this.currentOver = Math.floor(balls.length / 6);
    this.currentOverBalls = balls.filter(b => 
      Math.floor(b.over_number) === this.currentOver
    );
  }

  private loadPlayers(): void {
    this.availableBatsmen = this.playerService
      .getPlayersByTeam(this.innings.batting_team_id)
      .filter(p => p.status === 'playing');

    this.availableBowlers = this.playerService
      .getPlayersByTeam(this.innings.bowling_team_id)
      .filter(p => p.status === 'playing' && 
        (p.roles.includes('Bowler') || p.roles.includes('All Rounder'))
      );
  }

  getBattingTeamName(): string {
    // Implementation needed
    return '';
  }

  getBallDisplay(ball: Ball): string {
    if (ball.outcome === 'wicket') return 'W';
    if (ball.outcome === 'wide') return 'Wd';
    if (ball.outcome === 'no_ball') return 'Nb';
    if (ball.outcome === 'bye') return `${ball.runs}B`;
    if (ball.outcome === 'leg_bye') return `${ball.runs}Lb`;
    return ball.runs.toString();
  }

  addRuns(runs: number): void {
    const ball: Ball = {
      id: `${this.innings.id}_${this.currentOver}_${this.currentOverBalls.length + 1}`,
      innings_id: this.innings.id,
      over_number: this.currentOver,
      ball_number: this.currentOverBalls.length + 1,
      batsman_id: this.currentBatsman,
      bowler_id: this.currentBowler,
      runs,
      extras: 0,
      outcome: 'regular',
      timestamp: new Date()
    };

    this.ballService.addBall(ball);
    this.updateInningsScore(runs);
    this.loadCurrentOver();
  }

  addExtra(type: BallOutcome): void {
    // Implementation needed
  }

  showWicketDialog(): void {
    // Implementation needed
  }

  undoLastBall(): void {
    if (this.currentOverBalls.length > 0) {
      const lastBall = this.currentOverBalls[this.currentOverBalls.length - 1];
      this.ballService.deleteBall(lastBall.id);
      this.updateInningsScore(-lastBall.runs);
      this.loadCurrentOver();
    }
  }

  endOver(): void {
    if (this.currentOverBalls.length === 6) {
      this.currentOver++;
      this.currentOverBalls = [];
      // Implement logic to switch bowler and possibly batsmen
    }
  }

  private updateInningsScore(runs: number): void {
    this.innings.total_runs += runs;
    this.innings.overs = this.currentOver + (this.currentOverBalls.length / 6);
    this.inningsService.updateInnings(this.innings);
  }
}