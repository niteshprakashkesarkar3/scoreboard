import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Innings } from '../../models/innings.model';
import { Ball, BallOutcome } from '../../models/ball.model';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { InningsService } from '../../services/innings.service';
import { BallService } from '../../services/ball.service';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { MatchService } from '../../services/match.service';
import { ButtonComponent } from '../shared/button/button.component';
import { SelectComponent } from '../shared/select/select.component';
import { WicketDialogComponent, WicketDetails } from './wicket-dialog.component';
import { RetireDialogComponent, RetireDetails } from './retire-dialog.component';

interface BatsmanStats {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isStriker: boolean;
}

interface BowlerStats {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface OverStats {
  overNumber: number;
  bowlerId: string;
  bowlerName: string;
  runs: number;
  wickets: number;
  balls: Ball[];
}

@Component({
  selector: 'app-innings-scoring',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonComponent, 
    SelectComponent,
    WicketDialogComponent,
    RetireDialogComponent
  ],
  template: `
    <div class="innings-scoring-container" *ngIf="innings">
      <!-- Innings Complete Dialog -->
      <div class="dialog-overlay" *ngIf="showInningsCompleteDialog">
        <div class="dialog-content">
          <h3>{{ getInningsCompleteTitle() }}</h3>
          <div class="innings-summary">
            <p><strong>{{ getBattingTeamName() }}</strong></p>
            <p class="score">{{ innings.total_runs }}/{{ innings.wickets }} ({{ getFormattedOvers() }} overs)</p>
            <p *ngIf="isFirstInnings()">Target: {{ innings.total_runs + 1 }} runs</p>
            <p *ngIf="!isFirstInnings()">{{ getMatchResult() }}</p>
          </div>
          <div class="dialog-actions">
            <app-button 
              variant="primary" 
              (onClick)="handleInningsComplete()"
              *ngIf="isFirstInnings()"
            >
              Start Second Innings
            </app-button>
            <app-button 
              variant="primary" 
              (onClick)="viewMatchResults()"
              *ngIf="!isFirstInnings()"
            >
              View Match Results
            </app-button>
          </div>
        </div>
      </div>

      <div class="scoring-header">
        <h2>{{ getBattingTeamName() }} Innings {{ isFirstInnings() ? '(1st)' : '(2nd)' }}</h2>
        <div class="score-summary">
          <span class="total-score">{{ innings.total_runs }}/{{ innings.wickets }}</span>
          <span class="overs">{{ getFormattedOvers() }} overs</span>
          <span class="target" *ngIf="!isFirstInnings() && targetRuns > 0">
            Target: {{ targetRuns }} (Need {{ targetRuns - innings.total_runs }} runs)
          </span>
        </div>
      </div>

      <div class="batting-stats">
        <h3>Batting Statistics</h3>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let batsman of getBatsmanStats()">
              <td class="team-name">{{ batsman.name }}{{ batsman.isStriker ? '*' : '' }}</td>
              <td>{{ batsman.runs }}</td>
              <td>{{ batsman.balls }}</td>
              <td>{{ batsman.fours }}</td>
              <td>{{ batsman.sixes }}</td>
              <td>{{ batsman.strikeRate | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bowling-stats">
        <h3>Bowling Statistics</h3>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bowler of getBowlerStats()">
              <td class="team-name">{{ bowler.name }}</td>
              <td>{{ getFormattedOvers(bowler.overs) }}</td>
              <td>{{ bowler.maidens }}</td>
              <td>{{ bowler.runs }}</td>
              <td>{{ bowler.wickets }}</td>
              <td>{{ bowler.economy | number:'1.1-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="over-by-over">
        <h3>Over by Over</h3>
        <div class="over-details" *ngFor="let over of getOverByOverStats()">
          <div class="over-header">
            <span class="over-number">Over {{ over.overNumber + 1 }}</span>
            <span class="bowler-name">{{ over.bowlerName }}</span>
            <span class="over-summary">{{ over.runs }} runs, {{ over.wickets }} wickets</span>
          </div>
          <div class="balls-container">
            <div *ngFor="let ball of over.balls" class="ball">
              {{ getBallDisplay(ball) }}
            </div>
          </div>
        </div>
      </div>

      <div class="current-over">
        <h3>Over {{ currentOver + 1 }}</h3>
        <div class="balls-container">
          <div *ngFor="let ball of currentOverBalls" class="ball">
            {{ getBallDisplay(ball) }}
          </div>
        </div>
      </div>

      <div class="scoring-controls" *ngIf="!isInningsComplete()">
        <div class="batsman-bowler">
          <div class="player-select">
            <label>Striker</label>
            <app-select
              [(ngModel)]="currentBatsman"
              [required]="true"
              placeholder="Select Striker"
            >
              <option *ngFor="let player of availableBatsmen" [value]="player.id">
                {{ player.name }}
              </option>
            </app-select>
          </div>

          <div class="player-select">
            <label>Non-Striker</label>
            <app-select
              [(ngModel)]="nonStriker"
              [required]="true"
              placeholder="Select Non-Striker"
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
          <app-button variant="secondary" (onClick)="swapBatsmen()">Swap Batsmen</app-button>
          <app-button variant="secondary" (onClick)="showRetireDialog()">Retire Player</app-button>
        </div>

        <div class="action-buttons">
          <app-button variant="secondary" (onClick)="undoLastBall()">Undo</app-button>
          <app-button 
            variant="primary" 
            (onClick)="endOver()"
            [disabled]="getValidBallsInCurrentOver() < 6"
          >
            End Over
          </app-button>
        </div>
      </div>

      <div class="innings-complete-message" *ngIf="isInningsComplete()">
        <h3>{{ getInningsCompleteTitle() }}</h3>
        <p>{{ getBattingTeamName() }}: {{ innings.total_runs }}/{{ innings.wickets }} ({{ getFormattedOvers() }} overs)</p>
        <app-button variant="primary" (onClick)="showInningsCompleteDialog = true">
          {{ isFirstInnings() ? 'Start Second Innings' : 'View Match Results' }}
        </app-button>
      </div>
    </div>

    <app-wicket-dialog
      *ngIf="showingWicketDialog"
      [fieldingTeam]="availableBowlers"
      (onConfirm)="handleWicket($event)"
      (onCancel)="hideWicketDialog()"
    ></app-wicket-dialog>

    <app-retire-dialog
      *ngIf="showingRetireDialog"
      [currentBatsman]="currentBatsman"
      [nonStriker]="nonStriker"
      [availablePlayers]="getAvailableReplacements()"
      [currentPlayers]="availableBatsmen"
      (onConfirm)="handleRetire($event)"
      (onCancel)="hideRetireDialog()"
    ></app-retire-dialog>
  `,
  styles: [`
    .innings-scoring-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .innings-summary {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .innings-summary .score {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1B5E20;
      margin: 0.5rem 0;
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
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

    .target {
      font-size: 1rem;
      color: #d32f2f;
      font-weight: bold;
      display: block;
      margin-top: 0.5rem;
    }

    .batting-stats,
    .bowling-stats {
      margin-bottom: 2rem;
    }

    .stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .stats-table th,
    .stats-table td {
      padding: 0.75rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    .stats-table th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .stats-table td:first-child {
      text-align: left;
      font-weight: 500;
    }

    .over-by-over {
      margin-bottom: 2rem;
    }

    .over-details {
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .over-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .over-number {
      font-weight: bold;
      color: #1B5E20;
    }

    .bowler-name {
      color: #666;
    }

    .over-summary {
      font-weight: 500;
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

    .wicket-controls {
      display: flex;
      gap: 1rem;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .innings-complete-message {
      text-align: center;
      padding: 2rem;
      background: #e8f5e8;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .innings-complete-message h3 {
      color: #1B5E20;
      margin-bottom: 1rem;
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

      .wicket-controls {
        flex-direction: column;
      }
    }
  `]
})
export class InningsScoringComponent implements OnInit {
  innings!: Innings;
  match!: Match;
  currentOver = 0;
  currentOverBalls: Ball[] = [];
  currentBatsman = '';
  nonStriker = '';
  currentBowler = '';
  availableBatsmen: Player[] = [];
  availableBowlers: Player[] = [];
  showingWicketDialog = false;
  showingRetireDialog = false;
  showInningsCompleteDialog = false;
  teams: Team[] = [];
  matchInnings: Innings[] = [];
  retiredPlayers: string[] = [];
  targetRuns = 0;

  constructor(
    private inningsService: InningsService,
    private ballService: BallService,
    private playerService: PlayerService,
    private teamService: TeamService,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const inningsId = this.route.snapshot.paramMap.get('inningsId');
    const matchId = this.route.snapshot.paramMap.get('id') || '';
    if (!inningsId || !matchId) {
      this.router.navigate(['/matches']);
      return;
    }

    this.loadMatch(matchId);
    this.loadInnings();
    const innings = this.inningsService.getInningsByMatch(matchId).find(i => i.id === inningsId);
    if (innings) {
      this.innings = innings;
      this.loadCurrentOver();
      this.loadPlayers();
      this.calculateTarget();
    } else {
      this.router.navigate(['/matches']);
      return;
    }

    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });
  }

  private loadMatch(matchId: string): void {
    this.matchService.matches$.subscribe(matches => {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        this.match = match;
      }
    });
  }

  private calculateTarget(): void {
    if (!this.isFirstInnings()) {
      const firstInnings = this.matchInnings.find(i => i.id.endsWith('_1st'));
      if (firstInnings) {
        this.targetRuns = firstInnings.total_runs + 1;
      }
    }
  }

  isFirstInnings(): boolean {
    return this.innings.id.endsWith('_1st');
  }

  isInningsComplete(): boolean {
    const totalOvers = this.match?.total_overs || 20;
    const allOut = this.innings.wickets >= 10;
    const oversComplete = this.innings.overs >= totalOvers;
    const targetChased = !this.isFirstInnings() && this.innings.total_runs >= this.targetRuns;
    
    return allOut || oversComplete || targetChased;
  }

  getInningsCompleteTitle(): string {
    if (this.isFirstInnings()) {
      return 'First Innings Complete';
    } else {
      return 'Second Innings Complete';
    }
  }

  getMatchResult(): string {
    if (this.isFirstInnings()) return '';
    
    const firstInnings = this.matchInnings.find(i => i.id.endsWith('_1st'));
    if (!firstInnings) return '';

    const team1Score = firstInnings.total_runs;
    const team2Score = this.innings.total_runs;
    
    if (team2Score >= this.targetRuns) {
      const wicketsRemaining = 10 - this.innings.wickets;
      const ballsRemaining = (this.match.total_overs! * 6) - (Math.floor(this.innings.overs) * 6 + Math.round((this.innings.overs % 1) * 6));
      return `${this.getBattingTeamName()} won by ${wicketsRemaining} wickets (${ballsRemaining} balls remaining)`;
    } else {
      const runsMargin = team1Score - team2Score;
      const firstInningsTeam = this.teams.find(t => t.id === firstInnings.batting_team_id)?.name || 'Team';
      return `${firstInningsTeam} won by ${runsMargin} runs`;
    }
  }

  handleInningsComplete(): void {
    if (this.isFirstInnings()) {
      // Mark first innings as completed
      this.innings.status = 'completed';
      this.inningsService.updateInnings(this.innings);
      
      // Start second innings
      this.startSecondInnings();
    } else {
      // Mark second innings as completed and match as completed
      this.innings.status = 'completed';
      this.inningsService.updateInnings(this.innings);
      
      this.match.status = 'completed';
      this.matchService.updateMatch(this.match);
      
      this.viewMatchResults();
    }
  }

  private startSecondInnings(): void {
    const battingTeamId = this.getOtherTeamId(this.innings.batting_team_id);
    const bowlingTeamId = this.innings.batting_team_id;

    const secondInnings: Innings = {
      id: `${this.match.id}_2nd`,
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

    this.inningsService.addInnings(secondInnings);
    this.router.navigate(['/matches', this.match.id, 'innings', secondInnings.id]);
  }

  private getOtherTeamId(teamId: string): string {
    return teamId === this.match.team1_id ? this.match.team2_id : this.match.team1_id;
  }

  viewMatchResults(): void {
    this.router.navigate(['/matches', this.match.id, 'scoring']);
  }

  getBatsmanStats(): BatsmanStats[] {
    const balls = this.ballService.getBallsByInnings(this.innings.id);
    const batsmanStats = new Map<string, BatsmanStats>();

    balls.forEach(ball => {
      if (!ball.batsman_id) return;

      const batsman = this.availableBatsmen.find(b => b.id === ball.batsman_id);
      if (!batsman) return;

      const stats = batsmanStats.get(batsman.id) || {
        id: batsman.id,
        name: batsman.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isStriker: false
      };

      if (ball.outcome !== 'wide' && ball.outcome !== 'no_ball') {
        stats.balls++;
      }

      if (ball.outcome === 'regular') {
        stats.runs += ball.runs;
        if (ball.runs === 4) stats.fours++;
        if (ball.runs === 6) stats.sixes++;
      }

      stats.strikeRate = (stats.balls > 0) ? (stats.runs / stats.balls) * 100 : 0;
      stats.isStriker = stats.id === this.currentBatsman;

      batsmanStats.set(batsman.id, stats);
    });

    return Array.from(batsmanStats.values());
  }

  getFormattedOvers(overs?: number): string {
    const oversToFormat = overs ?? this.innings.overs;
    const completedOvers = Math.floor(oversToFormat);
    const validBalls = Math.round((oversToFormat - completedOvers) * 6);
    return `${completedOvers}.${validBalls}`;
  }

  getBowlerStats(): BowlerStats[] {
    const balls = this.ballService.getBallsByInnings(this.innings.id);
    const bowlerStats = new Map<string, BowlerStats>();

    balls.forEach(ball => {
      const bowler = this.availableBowlers.find(b => b.id === ball.bowler_id);
      if (!bowler) return;

      const stats = bowlerStats.get(bowler.id) || {
        id: bowler.id,
        name: bowler.name,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0
      };

      stats.runs += ball.runs + ball.extras;
      if (ball.outcome === 'wicket') stats.wickets++;

      const validBalls = balls.filter(b => 
        b.bowler_id === bowler.id && 
        b.outcome !== 'wide' && 
        b.outcome !== 'no_ball'
      ).length;

      stats.overs = Math.floor(validBalls / 6) + (validBalls % 6) / 6;
      stats.economy = stats.overs > 0 ? stats.runs / stats.overs : 0;

      bowlerStats.set(bowler.id, stats);
    });

    Array.from(bowlerStats.values()).forEach(stats => {
      const bowlerBalls = balls.filter(b => b.bowler_id === stats.id);
      const overs = this.groupBallsByOver(bowlerBalls);
      stats.maidens = overs.filter(over => 
        over.every(ball => ball.runs === 0 && ball.extras === 0)
      ).length;
    });

    return Array.from(bowlerStats.values());
  }

  getOverByOverStats(): OverStats[] {
    const balls = this.ballService.getBallsByInnings(this.innings.id);
    const overs: OverStats[] = [];

    for (let i = 0; i <= this.currentOver; i++) {
      const overBalls = balls.filter(b => Math.floor(b.over_number) === i);
      if (overBalls.length === 0) continue;

      const bowler = this.availableBowlers.find(b => b.id === overBalls[0].bowler_id);
      if (!bowler) continue;

      overs.push({
        overNumber: i,
        bowlerId: bowler.id,
        bowlerName: bowler.name,
        runs: overBalls.reduce((sum, ball) => sum + ball.runs + ball.extras, 0),
        wickets: overBalls.filter(b => b.outcome === 'wicket').length,
        balls: overBalls
      });
    }

    return overs;
  }

  private groupBallsByOver(balls: Ball[]): Ball[][] {
    const overs: Ball[][] = [];
    let currentOver: Ball[] = [];
    let validBallCount = 0;

    balls.forEach(ball => {
      if (validBallCount === 6) {
        overs.push(currentOver);
        currentOver = [];
        validBallCount = 0;
      }

      currentOver.push(ball);
      if (ball.outcome !== 'wide' && ball.outcome !== 'no_ball') {
        validBallCount++;
      }
    });

    if (currentOver.length > 0) {
      overs.push(currentOver);
    }

    return overs;
  }

  loadInnings(): void {
    this.matchInnings = this.inningsService.getInningsByMatch(this.route.snapshot.paramMap.get('id') || '');
  }

  private loadCurrentOver(): void {
    if (!this.innings) return;
    
    const balls = this.ballService.getBallsByInnings(this.innings.id);
    this.currentOver = Math.floor(balls.length / 6);
    this.currentOverBalls = balls.filter(b => 
      Math.floor(b.over_number) === this.currentOver
    );
  }

  private loadPlayers(): void {
    if (!this.innings) return;

    this.availableBatsmen = this.playerService
      .getPlayersByTeam(this.innings.batting_team_id)
      .filter(p => p.status === 'playing');

    this.availableBowlers = this.playerService
      .getPlayersByTeam(this.innings.bowling_team_id)
      .filter(p => p.status === 'playing' && 
        (p.roles.includes('Bowler') || p.roles.includes('All Rounder'))
      );

    const setupData = localStorage.getItem('match_setup_' + this.innings.match_id);
    if (setupData) {
      const { striker_id, non_striker_id, opening_bowler_id } = JSON.parse(setupData);
      this.currentBatsman = striker_id;
      this.nonStriker = non_striker_id;
      this.currentBowler = opening_bowler_id;
    }
  }

  getBattingTeamName(): string {
    if (!this.innings) return '';
    
    const team = this.teams.find((t: Team) => t.id === this.innings.batting_team_id);
    return team ? team.name : '';
  }

  getBallDisplay(ball: Ball): string {
    if (ball.outcome === 'wicket') return 'W';
    if (ball.outcome === 'wide') return 'Wd';
    if (ball.outcome === 'no_ball') return 'Nb';
    if (ball.outcome === 'bye') return `${ball.runs}B`;
    if (ball.outcome === 'leg_bye') return `${ball.runs}Lb`;
    return ball.runs.toString();
  }

  swapBatsmen(): void {
    [this.currentBatsman, this.nonStriker] = [this.nonStriker, this.currentBatsman];
  }

  addRuns(runs: number): void {
    if (!this.innings) return;
    if (!this.currentBatsman || !this.currentBowler || !this.nonStriker) {
      alert('Please select both batsmen and bowler');
      return;
    }

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

    if (runs % 2 === 1) {
      this.swapBatsmen();
    }

    this.checkInningsComplete();
  }

  addExtra(type: BallOutcome): void {
    if (!this.innings) return;
    if (!this.currentBowler) {
      alert('Please select a bowler');
      return;
    }

    const ball: Ball = {
      id: `${this.innings.id}_${this.currentOver}_${this.currentOverBalls.length + 1}`,
      innings_id: this.innings.id,
      over_number: this.currentOver,
      ball_number: this.currentOverBalls.length + 1,
      batsman_id: this.currentBatsman,
      bowler_id: this.currentBowler,
      runs: 1,
      extras: 1,
      outcome: type,
      timestamp: new Date()
    };

    this.ballService.addBall(ball);
    this.updateInningsScore(1);
    
    if (type === 'wide' || type === 'no_ball') {
      this.currentOverBalls = this.currentOverBalls.slice(0, -1);
    }
    
    this.loadCurrentOver();
    this.checkInningsComplete();
  }

  showWicketDialog(): void {
    if (!this.innings) return;
    if (!this.currentBatsman || !this.currentBowler || !this.nonStriker) {
      alert('Please select both batsmen and bowler');
      return;
    }
    this.showingWicketDialog = true;
  }

  hideWicketDialog(): void {
    this.showingWicketDialog = false;
  }

  handleWicket(details: WicketDetails): void {
    if (!this.innings) return;

    const ball: Ball = {
      id: `${this.innings.id}_${this.currentOver}_${this.currentOverBalls.length + 1}`,
      innings_id: this.innings.id,
      over_number: this.currentOver,
      ball_number: this.currentOverBalls.length + 1,
      batsman_id: this.currentBatsman,
      bowler_id: this.currentBowler,
      runs: details.runs || 0,
      extras: 0,
      outcome: 'wicket',
      wicket_type: details.type,
      fielder_id: details.fielderId,
      timestamp: new Date()
    };

    this.ballService.addBall(ball);
    this.innings.wickets++;
    this.updateInningsScore(details.runs || 0);
    this.hideWicketDialog();
    this.loadCurrentOver();
    
    this.currentBatsman = '';
    this.checkInningsComplete();
  }

  undoLastBall(): void {
    if (!this.innings) return;
    if (this.currentOverBalls.length > 0) {
      const lastBall = this.currentOverBalls[this.currentOverBalls.length - 1];
      
      if (lastBall.outcome === 'wicket') {
        this.innings.wickets--;
      }
      
      this.ballService.deleteBall(lastBall.id);
      this.updateInningsScore(-(lastBall.runs + lastBall.extras));
      this.loadCurrentOver();
    }
  }

  endOver(): void {
    if (!this.innings) return;
    if (this.getValidBallsInCurrentOver() === 6) {
      this.currentOver++;
      this.currentOverBalls = [];
      this.currentBowler = '';
      this.swapBatsmen();
      this.checkInningsComplete();
    }
  }

  private updateInningsScore(runs: number): void {
    if (!this.innings) return;
    this.innings.total_runs += runs;

    const allBalls = this.ballService.getBallsByInnings(this.innings.id);
    const validBalls = allBalls.filter(ball => 
      ball.outcome !== 'wide' && ball.outcome !== 'no_ball'
    ).length;

    this.innings.overs = Math.floor(validBalls / 6) + (validBalls % 6) / 6;
    this.inningsService.updateInnings(this.innings);
  }

  private checkInningsComplete(): void {
    if (this.isInningsComplete()) {
      this.showInningsCompleteDialog = true;
    }
  }

  getValidBallsInCurrentOver(): number {
    return this.currentOverBalls.filter(ball => 
      ball.outcome !== 'wide' && ball.outcome !== 'no_ball'
    ).length;
  }

  showRetireDialog(): void {
    if (!this.innings) return;
    if (!this.currentBatsman || !this.nonStriker) {
      alert('Please select both batsmen');
      return;
    }
    this.showingRetireDialog = true;
  }

  hideRetireDialog(): void {
    this.showingRetireDialog = false;
  }

  getAvailableReplacements(): Player[] {
    return this.availableBatsmen.filter(player => 
      player.id !== this.currentBatsman && 
      player.id !== this.nonStriker &&
      !this.retiredPlayers.includes(player.id)
    );
  }

  handleRetire(details: RetireDetails): void {
    if (details.retiredPlayerId === this.currentBatsman) {
      this.currentBatsman = details.replacementPlayerId;
    } else {
      this.nonStriker = details.replacementPlayerId;
    }

    this.retiredPlayers.push(details.retiredPlayerId);
    this.hideRetireDialog();
  }
}