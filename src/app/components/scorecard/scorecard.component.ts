import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match, Innings, Over, Delivery } from '../../models/match.model';
import { Team, Player } from '../../models/team.model';
import { CricketDataService } from '../../services/cricket-data.service';

interface BattingScorecard {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissalType?: string;
  bowler?: string;
  fielder?: string;
}

interface BowlingScorecard {
  playerId: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scorecard-container">
      <div class="innings-tabs">
        <button *ngFor="let innings of match.innings; let i = index"
                class="innings-tab"
                [class.active]="selectedInningsIndex === i"
                (click)="selectInnings(i)">
          {{ getTeamName(innings.battingTeam) }} Innings
        </button>
      </div>
      
      <div class="scorecard" *ngIf="selectedInnings">
        <div class="score-summary">
          <h3>{{ getTeamName(selectedInnings.battingTeam) }}</h3>
          <div class="score-display">
            <span class="score">{{ selectedInnings.totalRuns }}/{{ selectedInnings.wickets }}</span>
            <span class="overs">({{ formatOvers(selectedInnings.overs) }} Overs)</span>
          </div>
        </div>
        
        <div class="extras-summary" *ngIf="selectedInnings.extras.total > 0">
          <span>Extras: {{ selectedInnings.extras.total }}</span>
          <span>(WD: {{ selectedInnings.extras.wides }}, NB: {{ selectedInnings.extras.noBalls }}, 
                B: {{ selectedInnings.extras.byes }}, LB: {{ selectedInnings.extras.legByes }},
                P: {{ selectedInnings.extras.penalties }})</span>
        </div>
        
        <h3>Batting</h3>
        <table class="batting-table">
          <thead>
            <tr>
              <th class="batter-name">Batter</th>
              <th></th>
              <th class="runs">R</th>
              <th class="balls">B</th>
              <th class="fours">4s</th>
              <th class="sixes">6s</th>
              <th class="sr">SR</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let batter of battingScorecard">
              <td class="batter-name">{{ batter.name }}</td>
              <td class="dismissal">
                <span *ngIf="batter.dismissalType">
                  {{ batter.dismissalType }}
                  <ng-container *ngIf="batter.dismissalType === 'b'">
                    {{ getPlayerName(batter.bowler || '') }}
                  </ng-container>
                  <ng-container *ngIf="batter.dismissalType === 'c'">
                    {{ getPlayerName(batter.fielder || '') }} 
                    b {{ getPlayerName(batter.bowler || '') }}
                  </ng-container>
                  <ng-container *ngIf="batter.dismissalType === 'st'">
                    {{ getPlayerName(batter.fielder || '') }} 
                    b {{ getPlayerName(batter.bowler || '') }}
                  </ng-container>
                </span>
                <span *ngIf="!batter.dismissalType">not out</span>
              </td>
              <td class="runs">{{ batter.runs }}</td>
              <td class="balls">{{ batter.balls }}</td>
              <td class="fours">{{ batter.fours }}</td>
              <td class="sixes">{{ batter.sixes }}</td>
              <td class="sr">{{ batter.strikeRate.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="fall-of-wickets">
          <h4>Fall of Wickets</h4>
          <div class="wickets-list">
            <!-- In a full implementation, this would show wickets with scores -->
            <span *ngFor="let wicket of getFallOfWickets(selectedInnings)" class="wicket">
              {{ wicket.playerName }}: {{ wicket.teamScore }}/{{ wicket.wicketNumber }}
              ({{ formatOvers(wicket.atOver) }})
            </span>
          </div>
        </div>
        
        <h3>Bowling</h3>
        <table class="bowling-table">
          <thead>
            <tr>
              <th class="bowler-name">Bowler</th>
              <th class="overs">O</th>
              <th class="maidens">M</th>
              <th class="runs">R</th>
              <th class="wickets">W</th>
              <th class="economy">Econ</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bowler of bowlingScorecard">
              <td class="bowler-name">{{ bowler.name }}</td>
              <td class="overs">{{ formatOvers(bowler.overs) }}</td>
              <td class="maidens">{{ bowler.maidens }}</td>
              <td class="runs">{{ bowler.runs }}</td>
              <td class="wickets">{{ bowler.wickets }}</td>
              <td class="economy">{{ bowler.economy.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .scorecard-container {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .innings-tabs {
      display: flex;
      background-color: #f5f5f5;
      padding: 0.5rem;
    }
    
    .innings-tab {
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      margin-right: 0.5rem;
    }
    
    .innings-tab.active {
      background-color: #1B5E20;
      color: white;
    }
    
    .scorecard {
      padding: 1rem;
    }
    
    .score-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .score-summary h3 {
      margin: 0;
      color: #1B5E20;
    }
    
    .score-display {
      font-family: 'Courier New', monospace;
    }
    
    .score {
      font-size: 1.25rem;
      font-weight: bold;
    }
    
    .extras-summary {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    
    th, td {
      padding: 0.5rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    
    th {
      font-weight: bold;
      color: #1B5E20;
      border-bottom: 2px solid #1B5E20;
    }
    
    .batter-name, .bowler-name {
      text-align: left;
      font-weight: 500;
    }
    
    .dismissal {
      text-align: left;
      font-size: 0.8rem;
      color: #666;
      max-width: 200px;
    }
    
    .fall-of-wickets {
      margin-bottom: 1.5rem;
    }
    
    .fall-of-wickets h4 {
      margin-top: 0;
      color: #1B5E20;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.5rem;
    }
    
    .wickets-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .wicket {
      background-color: #ffebee;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
  `]
})
export class ScorecardComponent implements OnInit {
  @Input() match!: Match;
  
  selectedInningsIndex: number = 0;
  selectedInnings: Innings | null = null;
  
  battingScorecard: BattingScorecard[] = [];
  bowlingScorecard: BowlingScorecard[] = [];
  
  constructor(private cricketDataService: CricketDataService) {}
  
  ngOnInit(): void {
    // Initialize with the first innings
    if (this.match && this.match.innings.length > 0) {
      this.selectInnings(0);
    }
  }
  
  selectInnings(index: number): void {
    this.selectedInningsIndex = index;
    this.selectedInnings = this.match.innings[index];
    
    if (this.selectedInnings) {
      this.generateBattingScorecard();
      this.generateBowlingScorecard();
    }
  }
  
  getTeamName(teamId: string): string {
    const team = this.cricketDataService.getTeamById(teamId);
    return team ? team.name : 'Unknown Team';
  }
  
  getPlayerName(playerId: string): string {
    const player = this.cricketDataService.getPlayerById(playerId);
    return player ? player.name : 'Unknown Player';
  }
  
  formatOvers(overs: number): string {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  }
  
  private generateBattingScorecard(): void {
    if (!this.selectedInnings) return;
    
    const battingTeam = this.cricketDataService.getTeamById(this.selectedInnings.battingTeam);
    if (!battingTeam) return;
    
    // Reset scorecard
    this.battingScorecard = [];
    
    // Keep track of batsmen who have batted
    const batsmenIds = new Set<string>();
    
    // Process each over and delivery to generate scorecard
    for (const over of this.selectedInnings.overHistory) {
      for (const delivery of over.deliveries) {
        batsmenIds.add(delivery.batsman);
      }
    }
    
    // Generate batting scorecard
    Array.from(batsmenIds).forEach(batsmanId => {
      const player = this.cricketDataService.getPlayerById(batsmanId);
      
      if (player) {
        let runs = 0;
        let balls = 0;
        let fours = 0;
        let sixes = 0;
        let dismissalType: string | undefined;
        let bowlerId: string | undefined;
        let fielderId: string | undefined;
        
        // Process each delivery for this batsman
        for (const over of this.selectedInnings!.overHistory) {
          for (const delivery of over.deliveries) {
            if (delivery.batsman === batsmanId) {
              runs += delivery.runs;
              
              // Count ball only if not wide
              if (!delivery.isExtra || (delivery.extraType !== 'wide')) {
                balls += 1;
              }
              
              if (delivery.isBoundary) fours += 1;
              if (delivery.isSix) sixes += 1;
              
              // Check for dismissal
              if (delivery.isWicket) {
                switch(delivery.wicketType) {
                  case 'bowled':
                    dismissalType = 'b';
                    bowlerId = delivery.bowler;
                    break;
                  case 'caught':
                    dismissalType = 'c';
                    bowlerId = delivery.bowler;
                    fielderId = delivery.fielder;
                    break;
                  case 'lbw':
                    dismissalType = 'lbw';
                    bowlerId = delivery.bowler;
                    break;
                  case 'run out':
                    dismissalType = 'run out';
                    fielderId = delivery.fielder;
                    break;
                  case 'stumped':
                    dismissalType = 'st';
                    bowlerId = delivery.bowler;
                    fielderId = delivery.fielder;
                    break;
                  case 'hit wicket':
                    dismissalType = 'hit wkt';
                    bowlerId = delivery.bowler;
                    break;
                  default:
                    dismissalType = 'other';
                }
              }
            }
          }
        }
        
        this.battingScorecard.push({
          playerId: batsmanId,
          name: player.name,
          runs,
          balls,
          fours,
          sixes,
          strikeRate: balls > 0 ? (runs / balls) * 100 : 0,
          dismissalType,
          bowler: bowlerId,
          fielder: fielderId
        });
      }
    });
    
    // Sort scorecard by batting order
    // In a real app, we would track batting order explicitly
    this.battingScorecard.sort((a, b) => {
      const aFirstBall = this.getFirstBallForBatsman(a.playerId);
      const bFirstBall = this.getFirstBallForBatsman(b.playerId);
      return (aFirstBall?.over || 0) - (bFirstBall?.over || 0) || 
             (aFirstBall?.ball || 0) - (bFirstBall?.ball || 0);
    });
  }
  
  private getFirstBallForBatsman(batsmanId: string): { over: number, ball: number } | null {
    if (!this.selectedInnings) return null;
    
    for (const over of this.selectedInnings.overHistory) {
      for (const delivery of over.deliveries) {
        if (delivery.batsman === batsmanId) {
          return { over: over.number, ball: delivery.ball };
        }
      }
    }
    
    return null;
  }
  
  private generateBowlingScorecard(): void {
    if (!this.selectedInnings) return;
    
    const bowlingTeam = this.cricketDataService.getTeamById(this.selectedInnings.bowlingTeam);
    if (!bowlingTeam) return;
    
    // Reset scorecard
    this.bowlingScorecard = [];
    
    // Keep track of bowlers and their stats
    const bowlerStats: Map<string, BowlingScorecard> = new Map();
    
    // Process each over
    for (const over of this.selectedInnings.overHistory) {
      const bowlerId = over.bowler;
      
      if (!bowlerStats.has(bowlerId)) {
        const bowler = this.cricketDataService.getPlayerById(bowlerId);
        
        if (bowler) {
          bowlerStats.set(bowlerId, {
            playerId: bowlerId,
            name: bowler.name,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0
          });
        }
      }
      
      if (bowlerStats.has(bowlerId)) {
        const stats = bowlerStats.get(bowlerId)!;
        
        // Count legal deliveries
        const legalDeliveries = over.deliveries.filter(
          d => !d.isExtra || (d.extraType !== 'wide' && d.extraType !== 'no ball')
        ).length;
        
        // Add to overs bowled (using decimal format: 1.3 = 1 over and 3 balls)
        if (legalDeliveries === 6) {
          stats.overs += 1; // Full over
        } else {
          stats.overs += legalDeliveries / 10; // Partial over
        }
        
        // Count maiden over
        if (over.runs === 0 && legalDeliveries === 6) {
          stats.maidens += 1;
        }
        
        // Add runs conceded
        stats.runs += over.runs;
        
        // Count wickets
        for (const delivery of over.deliveries) {
          if (delivery.isWicket && 
              delivery.wicketType && 
              delivery.wicketType !== 'run out' &&
              delivery.wicketType !== 'other') {
            stats.wickets += 1;
          }
        }
        
        // Calculate economy rate
        stats.economy = stats.overs > 0 ? stats.runs / (Math.floor(stats.overs) + (stats.overs % 1) * 10/6) : 0;
        
        // Update the map
        bowlerStats.set(bowlerId, stats);
      }
    }
    
    // Convert map to array
    this.bowlingScorecard = Array.from(bowlerStats.values());
    
    // Sort by wickets (desc) then economy rate (asc)
    this.bowlingScorecard.sort((a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      return a.economy - b.economy;
    });
  }
  
  getFallOfWickets(innings: Innings): any[] {
    const wickets: any[] = [];
    
    if (!innings) return wickets;
    
    let wicketNumber = 0;
    
    for (const over of innings.overHistory) {
      for (const delivery of over.deliveries) {
        if (delivery.isWicket) {
          wicketNumber++;
          const player = this.cricketDataService.getPlayerById(delivery.batsman);
          
          wickets.push({
            playerName: player ? player.name : 'Unknown Player',
            teamScore: this.calculateScoreAtDelivery(innings, over.number, delivery.ball),
            wicketNumber,
            atOver: over.number + (delivery.ball - 1) / 6
          });
        }
      }
    }
    
    return wickets;
  }
  
  private calculateScoreAtDelivery(innings: Innings, overNumber: number, ballNumber: number): number {
    let score = 0;
    
    for (const over of innings.overHistory) {
      if (over.number < overNumber) {
        score += over.runs;
      } else if (over.number === overNumber) {
        for (const delivery of over.deliveries) {
          if (delivery.ball <= ballNumber) {
            score += delivery.totalRuns;
          }
        }
        break;
      }
    }
    
    return score;
  }
}