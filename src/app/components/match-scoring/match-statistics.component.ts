import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Innings } from '../../models/innings.model';
import { Ball } from '../../models/ball.model';
import { Player } from '../../models/player.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { InningsService } from '../../services/innings.service';
import { BallService } from '../../services/ball.service';
import { PlayerService } from '../../services/player.service';
import { ButtonComponent } from '../shared/button/button.component';

interface BatsmanStats {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
  dismissedBy?: string;
}

interface BowlerStats {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  dots: number;
  wides: number;
  noBalls: number;
}

interface Partnership {
  batsman1: string;
  batsman2: string;
  runs: number;
  balls: number;
  runRate: number;
  wicket: number;
}

interface FallOfWickets {
  wicket: number;
  runs: number;
  overs: number;
  batsman: string;
  dismissalType: string;
  bowler?: string;
  fielder?: string;
}

interface InningsStatistics {
  battingStats: BatsmanStats[];
  bowlingStats: BowlerStats[];
  partnerships: Partnership[];
  fallOfWickets: FallOfWickets[];
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  runRate: number;
  powerplayRuns: number;
  powerplayWickets: number;
  deathOversRuns: number;
  deathOversWickets: number;
}

@Component({
  selector: 'app-match-statistics',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="match-statistics-container" *ngIf="match">
      <div class="statistics-header">
        <h2>{{ getTeamName(match.team1_id) }} vs {{ getTeamName(match.team2_id) }}</h2>
        <p class="match-info">Match Statistics</p>
        <app-button variant="secondary" (onClick)="goBack()">
          Back to Match
        </app-button>
      </div>

      <!-- Match Summary -->
      <div class="match-summary" *ngIf="matchInnings.length > 0">
        <h3>Match Summary</h3>
        <div class="summary-cards">
          <div class="summary-card" *ngFor="let innings of matchInnings">
            <h4>{{ getTeamName(innings.batting_team_id) }} {{ getInningsLabel(innings) }}</h4>
            <div class="score">{{ innings.total_runs }}/{{ innings.wickets }}</div>
            <div class="overs">({{ innings.overs | number:'1.1-1' }} overs)</div>
            <div class="run-rate">RR: {{ getRunRate(innings) | number:'1.2-2' }}</div>
          </div>
        </div>
        <div class="match-result" *ngIf="match.status === 'completed'">
          <h4>{{ getMatchResult() }}</h4>
        </div>
      </div>

      <!-- Innings Statistics -->
      <div class="innings-statistics" *ngFor="let innings of matchInnings; let i = index">
        <h3>{{ getTeamName(innings.batting_team_id) }} {{ getInningsLabel(innings) }}</h3>
        
        <!-- Batting Statistics -->
        <div class="batting-section">
          <h4>Batting</h4>
          <div class="stats-table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Batsman</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                  <th>Dismissal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let batsman of inningsStats[i]?.battingStats">
                  <td class="player-name">{{ batsman.name }}</td>
                  <td class="runs">{{ batsman.runs }}</td>
                  <td>{{ batsman.balls }}</td>
                  <td>{{ batsman.fours }}</td>
                  <td>{{ batsman.sixes }}</td>
                  <td>{{ batsman.strikeRate | number:'1.2-2' }}</td>
                  <td class="dismissal">
                    <span *ngIf="batsman.isOut">
                      {{ batsman.dismissalType }}
                      <span *ngIf="batsman.dismissedBy"> b {{ batsman.dismissedBy }}</span>
                    </span>
                    <span *ngIf="!batsman.isOut" class="not-out">not out</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Extras and Total -->
          <div class="extras-summary">
            <p><strong>Extras:</strong> {{ inningsStats[i]?.extras.total }} 
              (w {{ inningsStats[i]?.extras.wides }}, nb {{ inningsStats[i]?.extras.noBalls }}, 
               b {{ inningsStats[i]?.extras.byes }}, lb {{ inningsStats[i]?.extras.legByes }})</p>
            <p><strong>Total:</strong> {{ innings.total_runs }}/{{ innings.wickets }} 
              ({{ innings.overs | number:'1.1-1' }} overs, RR: {{ inningsStats[i]?.runRate | number:'1.2-2' }})</p>
          </div>
        </div>

        <!-- Bowling Statistics -->
        <div class="bowling-section">
          <h4>Bowling</h4>
          <div class="stats-table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                  <th>Dots</th>
                  <th>Wd</th>
                  <th>Nb</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let bowler of inningsStats[i]?.bowlingStats">
                  <td class="player-name">{{ bowler.name }}</td>
                  <td>{{ getFormattedOvers(bowler.overs) }}</td>
                  <td>{{ bowler.maidens }}</td>
                  <td>{{ bowler.runs }}</td>
                  <td class="wickets">{{ bowler.wickets }}</td>
                  <td>{{ bowler.economy | number:'1.2-2' }}</td>
                  <td>{{ bowler.dots }}</td>
                  <td>{{ bowler.wides }}</td>
                  <td>{{ bowler.noBalls }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Partnerships -->
        <div class="partnerships-section" *ngIf="inningsStats[i]?.partnerships.length > 0">
          <h4>Partnerships</h4>
          <div class="stats-table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Wicket</th>
                  <th>Partnership</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>Run Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let partnership of inningsStats[i]?.partnerships">
                  <td>{{ partnership.wicket }}</td>
                  <td class="partnership-players">{{ partnership.batsman1 }} & {{ partnership.batsman2 }}</td>
                  <td class="runs">{{ partnership.runs }}</td>
                  <td>{{ partnership.balls }}</td>
                  <td>{{ partnership.runRate | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fall of Wickets -->
        <div class="fall-of-wickets-section" *ngIf="inningsStats[i]?.fallOfWickets.length > 0">
          <h4>Fall of Wickets</h4>
          <div class="stats-table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Wicket</th>
                  <th>Runs</th>
                  <th>Overs</th>
                  <th>Batsman</th>
                  <th>Dismissal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let wicket of inningsStats[i]?.fallOfWickets">
                  <td>{{ wicket.wicket }}</td>
                  <td class="runs">{{ wicket.runs }}</td>
                  <td>{{ wicket.overs | number:'1.1-1' }}</td>
                  <td class="player-name">{{ wicket.batsman }}</td>
                  <td class="dismissal">
                    {{ wicket.dismissalType }}
                    <span *ngIf="wicket.bowler"> b {{ wicket.bowler }}</span>
                    <span *ngIf="wicket.fielder"> c {{ wicket.fielder }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Phase-wise Analysis -->
        <div class="phase-analysis">
          <h4>Phase-wise Analysis</h4>
          <div class="phase-cards">
            <div class="phase-card">
              <h5>Powerplay (1-6 overs)</h5>
              <p>{{ inningsStats[i]?.powerplayRuns }}/{{ inningsStats[i]?.powerplayWickets }}</p>
              <span class="run-rate">RR: {{ getPowerplayRunRate(i) | number:'1.2-2' }}</span>
            </div>
            <div class="phase-card">
              <h5>Death Overs (17-20 overs)</h5>
              <p>{{ inningsStats[i]?.deathOversRuns }}/{{ inningsStats[i]?.deathOversWickets }}</p>
              <span class="run-rate">RR: {{ getDeathOversRunRate(i) | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .match-statistics-container {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .statistics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }

    .statistics-header h2 {
      margin: 0;
      color: #1B5E20;
    }

    .match-info {
      color: #666;
      margin: 0;
    }

    .match-summary {
      margin-bottom: 3rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .match-summary h3 {
      margin: 0 0 1.5rem;
      color: #1B5E20;
    }

    .summary-cards {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .summary-card {
      flex: 1;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .summary-card h4 {
      margin: 0 0 1rem;
      color: #1B5E20;
      font-size: 1.1rem;
    }

    .summary-card .score {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .summary-card .overs {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .summary-card .run-rate {
      color: #1B5E20;
      font-weight: 500;
    }

    .match-result {
      text-align: center;
      padding: 1rem;
      background: #4caf50;
      color: white;
      border-radius: 4px;
    }

    .match-result h4 {
      margin: 0;
      color: white;
    }

    .innings-statistics {
      margin-bottom: 3rem;
      padding: 2rem;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .innings-statistics h3 {
      margin: 0 0 2rem;
      color: #1B5E20;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #1B5E20;
    }

    .batting-section,
    .bowling-section,
    .partnerships-section,
    .fall-of-wickets-section {
      margin-bottom: 2rem;
    }

    .batting-section h4,
    .bowling-section h4,
    .partnerships-section h4,
    .fall-of-wickets-section h4 {
      margin: 0 0 1rem;
      color: #333;
      font-size: 1.2rem;
    }

    .stats-table-container {
      overflow-x: auto;
      margin-bottom: 1rem;
    }

    .stats-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
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
      color: #333;
    }

    .stats-table .player-name {
      text-align: left;
      font-weight: 500;
      color: #1B5E20;
    }

    .stats-table .partnership-players {
      text-align: left;
      font-weight: 500;
    }

    .stats-table .runs {
      font-weight: bold;
      color: #333;
    }

    .stats-table .wickets {
      font-weight: bold;
      color: #d32f2f;
    }

    .stats-table .dismissal {
      text-align: left;
      font-size: 0.9rem;
    }

    .stats-table .not-out {
      color: #4caf50;
      font-style: italic;
    }

    .extras-summary {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #1B5E20;
    }

    .extras-summary p {
      margin: 0.5rem 0;
      color: #333;
    }

    .phase-analysis h4 {
      margin: 0 0 1rem;
      color: #333;
      font-size: 1.2rem;
    }

    .phase-cards {
      display: flex;
      gap: 2rem;
    }

    .phase-card {
      flex: 1;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #eee;
    }

    .phase-card h5 {
      margin: 0 0 1rem;
      color: #1B5E20;
    }

    .phase-card p {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
      color: #333;
    }

    .phase-card .run-rate {
      color: #666;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .match-statistics-container {
        padding: 1rem;
      }

      .statistics-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .summary-cards {
        flex-direction: column;
        gap: 1rem;
      }

      .phase-cards {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-table {
        font-size: 0.9rem;
      }

      .stats-table th,
      .stats-table td {
        padding: 0.5rem;
      }
    }
  `]
})
export class MatchStatisticsComponent implements OnInit {
  match!: Match;
  teams: Team[] = [];
  matchInnings: Innings[] = [];
  inningsStats: InningsStatistics[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private inningsService: InningsService,
    private ballService: BallService,
    private playerService: PlayerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(id);
      this.loadTeams();
    } else {
      this.router.navigate(['/matches']);
    }
  }

  private loadMatch(id: string): void {
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

  private loadTeams(): void {
    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });
  }

  private loadInnings(): void {
    this.matchInnings = this.inningsService.getInningsByMatch(this.match.id);
    this.calculateStatistics();
  }

  private calculateStatistics(): void {
    this.inningsStats = this.matchInnings.map(innings => this.calculateInningsStats(innings));
  }

  private calculateInningsStats(innings: Innings): InningsStatistics {
    const balls = this.ballService.getBallsByInnings(innings.id);
    const battingTeamPlayers = this.playerService.getPlayersByTeam(innings.batting_team_id);
    const bowlingTeamPlayers = this.playerService.getPlayersByTeam(innings.bowling_team_id);

    return {
      battingStats: this.calculateBattingStats(balls, battingTeamPlayers),
      bowlingStats: this.calculateBowlingStats(balls, bowlingTeamPlayers),
      partnerships: this.calculatePartnerships(balls, battingTeamPlayers),
      fallOfWickets: this.calculateFallOfWickets(balls, battingTeamPlayers, bowlingTeamPlayers),
      extras: this.calculateExtras(balls),
      runRate: this.calculateRunRate(innings),
      powerplayRuns: this.calculatePowerplayRuns(balls),
      powerplayWickets: this.calculatePowerplayWickets(balls),
      deathOversRuns: this.calculateDeathOversRuns(balls),
      deathOversWickets: this.calculateDeathOversWickets(balls)
    };
  }

  private calculateBattingStats(balls: Ball[], players: Player[]): BatsmanStats[] {
    const batsmanStats = new Map<string, BatsmanStats>();

    balls.forEach(ball => {
      if (!ball.batsman_id) return;

      const player = players.find(p => p.id === ball.batsman_id);
      if (!player) return;

      const stats = batsmanStats.get(player.id) || {
        id: player.id,
        name: player.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOut: false
      };

      if (ball.outcome !== 'wide' && ball.outcome !== 'no_ball') {
        stats.balls++;
      }

      if (ball.outcome === 'regular') {
        stats.runs += ball.runs;
        if (ball.runs === 4) stats.fours++;
        if (ball.runs === 6) stats.sixes++;
      }

      if (ball.outcome === 'wicket') {
        stats.isOut = true;
        stats.dismissalType = this.formatDismissalType(ball.wicket_type);
        if (ball.bowler_id) {
          const bowler = players.find(p => p.id === ball.bowler_id);
          if (bowler) stats.dismissedBy = bowler.name;
        }
      }

      stats.strikeRate = stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0;
      batsmanStats.set(player.id, stats);
    });

    return Array.from(batsmanStats.values())
      .filter(stats => stats.balls > 0 || stats.isOut)
      .sort((a, b) => b.runs - a.runs);
  }

  private calculateBowlingStats(balls: Ball[], players: Player[]): BowlerStats[] {
    const bowlerStats = new Map<string, BowlerStats>();

    balls.forEach(ball => {
      const player = players.find(p => p.id === ball.bowler_id);
      if (!player) return;

      const stats = bowlerStats.get(player.id) || {
        id: player.id,
        name: player.name,
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
        dots: 0,
        wides: 0,
        noBalls: 0
      };

      stats.runs += ball.runs + ball.extras;
      if (ball.outcome === 'wicket') stats.wickets++;
      if (ball.runs === 0 && ball.extras === 0) stats.dots++;
      if (ball.outcome === 'wide') stats.wides++;
      if (ball.outcome === 'no_ball') stats.noBalls++;

      bowlerStats.set(player.id, stats);
    });

    // Calculate overs and economy for each bowler
    Array.from(bowlerStats.values()).forEach(stats => {
      const bowlerBalls = balls.filter(b => 
        b.bowler_id === stats.id && 
        b.outcome !== 'wide' && 
        b.outcome !== 'no_ball'
      );
      
      stats.overs = Math.floor(bowlerBalls.length / 6) + (bowlerBalls.length % 6) / 6;
      stats.economy = stats.overs > 0 ? stats.runs / stats.overs : 0;

      // Calculate maidens
      const overs = this.groupBallsByOver(balls.filter(b => b.bowler_id === stats.id));
      stats.maidens = overs.filter(over => 
        over.every(ball => ball.runs === 0 && ball.extras === 0)
      ).length;
    });

    return Array.from(bowlerStats.values())
      .filter(stats => stats.overs > 0)
      .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy);
  }

  private calculatePartnerships(balls: Ball[], players: Player[]): Partnership[] {
    const partnerships: Partnership[] = [];
    let currentPartnership: Partial<Partnership> = {};
    let wicketNumber = 1;
    let partnershipRuns = 0;
    let partnershipBalls = 0;
    let currentBatsmen = new Set<string>();

    balls.forEach(ball => {
      if (ball.batsman_id) {
        currentBatsmen.add(ball.batsman_id);
      }

      if (ball.outcome !== 'wide' && ball.outcome !== 'no_ball') {
        partnershipBalls++;
      }

      if (ball.outcome === 'regular') {
        partnershipRuns += ball.runs;
      }

      if (ball.outcome === 'wicket') {
        if (partnershipRuns > 0 && currentBatsmen.size >= 2) {
          const batsmenArray = Array.from(currentBatsmen);
          const batsman1 = players.find(p => p.id === batsmenArray[0])?.name || 'Unknown';
          const batsman2 = players.find(p => p.id === batsmenArray[1])?.name || 'Unknown';

          partnerships.push({
            wicket: wicketNumber,
            batsman1,
            batsman2,
            runs: partnershipRuns,
            balls: partnershipBalls,
            runRate: partnershipBalls > 0 ? (partnershipRuns / partnershipBalls) * 6 : 0
          });
        }

        wicketNumber++;
        partnershipRuns = 0;
        partnershipBalls = 0;
        currentBatsmen.delete(ball.batsman_id!);
      }
    });

    return partnerships;
  }

  private calculateFallOfWickets(balls: Ball[], battingPlayers: Player[], bowlingPlayers: Player[]): FallOfWickets[] {
    const fallOfWickets: FallOfWickets[] = [];
    let wicketNumber = 1;
    let totalRuns = 0;

    balls.forEach(ball => {
      if (ball.outcome === 'regular') {
        totalRuns += ball.runs;
      }

      if (ball.outcome === 'wicket') {
        const batsman = battingPlayers.find(p => p.id === ball.batsman_id)?.name || 'Unknown';
        const bowler = bowlingPlayers.find(p => p.id === ball.bowler_id)?.name;
        const fielder = bowlingPlayers.find(p => p.id === ball.fielder_id)?.name;

        fallOfWickets.push({
          wicket: wicketNumber,
          runs: totalRuns,
          overs: ball.over_number + (ball.ball_number / 6),
          batsman,
          dismissalType: this.formatDismissalType(ball.wicket_type),
          bowler,
          fielder
        });

        wicketNumber++;
      }
    });

    return fallOfWickets;
  }

  private calculateExtras(balls: Ball[]): any {
    const extras = {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
      total: 0
    };

    balls.forEach(ball => {
      if (ball.outcome === 'wide') extras.wides++;
      if (ball.outcome === 'no_ball') extras.noBalls++;
      if (ball.outcome === 'bye') extras.byes += ball.runs;
      if (ball.outcome === 'leg_bye') extras.legByes += ball.runs;
      extras.total += ball.extras;
    });

    return extras;
  }

  private calculateRunRate(innings: Innings): number {
    return innings.overs > 0 ? innings.total_runs / innings.overs : 0;
  }

  private calculatePowerplayRuns(balls: Ball[]): number {
    return balls
      .filter(ball => ball.over_number < 6 && ball.outcome === 'regular')
      .reduce((sum, ball) => sum + ball.runs, 0);
  }

  private calculatePowerplayWickets(balls: Ball[]): number {
    return balls.filter(ball => ball.over_number < 6 && ball.outcome === 'wicket').length;
  }

  private calculateDeathOversRuns(balls: Ball[]): number {
    return balls
      .filter(ball => ball.over_number >= 16 && ball.outcome === 'regular')
      .reduce((sum, ball) => sum + ball.runs, 0);
  }

  private calculateDeathOversWickets(balls: Ball[]): number {
    return balls.filter(ball => ball.over_number >= 16 && ball.outcome === 'wicket').length;
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

  private formatDismissalType(wicketType?: string): string {
    if (!wicketType) return 'Unknown';
    
    const types: { [key: string]: string } = {
      'caught': 'c',
      'bowled': 'b',
      'lbw': 'lbw',
      'run_out': 'run out',
      'stumped': 'st',
      'hit_wicket': 'hit wicket'
    };

    return types[wicketType] || wicketType;
  }

  getTeamName(id: string): string {
    const team = this.teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
  }

  getInningsLabel(innings: Innings): string {
    return innings.id.endsWith('_1st') ? '(1st Innings)' : '(2nd Innings)';
  }

  getRunRate(innings: Innings): number {
    return innings.overs > 0 ? innings.total_runs / innings.overs : 0;
  }

  getFormattedOvers(overs: number): string {
    const completedOvers = Math.floor(overs);
    const validBalls = Math.round((overs - completedOvers) * 6);
    return `${completedOvers}.${validBalls}`;
  }

  getPowerplayRunRate(inningsIndex: number): number {
    const stats = this.inningsStats[inningsIndex];
    if (!stats) return 0;
    return stats.powerplayRuns / 6; // 6 overs in powerplay
  }

  getDeathOversRunRate(inningsIndex: number): number {
    const stats = this.inningsStats[inningsIndex];
    if (!stats) return 0;
    return stats.deathOversRuns / 4; // 4 overs in death (17-20)
  }

  getMatchResult(): string {
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

  goBack(): void {
    this.router.navigate(['/matches', this.match.id, 'scoring']);
  }
}