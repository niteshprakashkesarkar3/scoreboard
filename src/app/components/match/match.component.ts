import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, Innings, Over, Delivery } from '../../models/match.model';
import { BallByBallComponent } from '../ball-by-ball/ball-by-ball.component';
import { ScorecardComponent } from '../scorecard/scorecard.component';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, FormsModule, BallByBallComponent, ScorecardComponent],
  template: `
    <div class="match-container" *ngIf="match">
      <div class="match-header">
        <div class="match-info">
          <h2>{{ getTeamName(match.teamA) }} vs {{ getTeamName(match.teamB) }}</h2>
          <p class="match-venue">{{ match.venue }} | {{ match.date | date:'medium' }}</p>
          <p class="match-toss">
            Toss: {{ getTeamName(match.tossWinner) }} chose to {{ match.tossDecision }}
          </p>
        </div>
        <div class="match-status" [ngClass]="match.status">
          {{ match.status }}
        </div>
      </div>
      
      <div class="scoreboard">
        <div class="team-score" *ngFor="let innings of match.innings">
          <div class="team-name">{{ getTeamName(innings.battingTeam) }}</div>
          <div class="score">
            <span class="runs">{{ innings.totalRuns }}</span>
            <span class="wickets">/{{ innings.wickets }}</span>
          </div>
          <div class="overs">({{ formatOvers(innings.overs) }})</div>
          <div class="extras" *ngIf="innings.extras.total > 0">
            Extras: {{ innings.extras.total }} 
            (WD: {{ innings.extras.wides }}, 
            NB: {{ innings.extras.noBalls }}, 
            B: {{ innings.extras.byes }}, 
            LB: {{ innings.extras.legByes }})
          </div>
        </div>
      </div>
      
      <div class="match-result" *ngIf="match.result">
        {{ getMatchResult() }}
      </div>
      
      <div class="tabs">
        <button class="tab" 
                [class.active]="activeTab === 'live'" 
                (click)="setActiveTab('live')">
          Live Scoring
        </button>
        <button class="tab" 
                [class.active]="activeTab === 'scorecard'" 
                (click)="setActiveTab('scorecard')">
          Scorecard
        </button>
      </div>
      
      <div class="tab-content">
        <app-ball-by-ball *ngIf="activeTab === 'live' && currentInnings"
                         [match]="match"
                         [innings]="currentInnings">
        </app-ball-by-ball>
        
        <app-scorecard *ngIf="activeTab === 'scorecard'"
                      [match]="match">
        </app-scorecard>
      </div>
    </div>
  `,
  styles: [`
    .match-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1rem;
      background-color: #FFF8E1;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .match-info h2 {
      color: #1B5E20;
      margin: 0 0 0.5rem;
    }
    
    .match-venue, .match-toss {
      margin: 0.25rem 0;
      color: #666;
    }
    
    .match-status {
      text-transform: uppercase;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .match-status.live {
      background-color: #ffcdd2;
      color: #d32f2f;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
    
    .match-status.completed {
      background-color: #c8e6c9;
      color: #2e7d32;
    }
    
    .match-status.upcoming {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .scoreboard {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .team-score {
      background-color: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      flex: 1;
      min-width: 200px;
    }
    
    .team-name {
      font-weight: bold;
      color: #1B5E20;
      margin-bottom: 0.5rem;
    }
    
    .score {
      display: flex;
      align-items: baseline;
      margin-bottom: 0.25rem;
    }
    
    .runs {
      font-family: 'Courier New', monospace;
      font-size: 2rem;
      font-weight: bold;
    }
    
    .wickets {
      font-family: 'Courier New', monospace;
      font-size: 1.5rem;
    }
    
    .overs {
      font-family: 'Courier New', monospace;
      color: #666;
      margin-bottom: 0.5rem;
    }
    
    .extras {
      font-size: 0.8rem;
      color: #666;
    }
    
    .match-result {
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
      color: #1B5E20;
      margin: 1rem 0;
      padding: 0.75rem;
      background-color: #c8e6c9;
      border-radius: 4px;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 1rem;
    }
    
    .tab {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
      color: #666;
    }
    
    .tab:hover {
      color: #1B5E20;
    }
    
    .tab.active {
      color: #1B5E20;
      border-bottom-color: #1B5E20;
    }
  `]
})
export class MatchComponent implements OnInit {
  match: Match | null = null;
  currentInnings: Innings | null = null;
  activeTab: 'live' | 'scorecard' = 'live';
  
  constructor(private cricketDataService: CricketDataService) {}
  
  ngOnInit(): void {
    this.cricketDataService.currentMatch$.subscribe(match => {
      this.match = match;
      
      if (match) {
        // Get the current innings (the last one that isn't completed)
        this.currentInnings = [...match.innings].reverse().find(inn => !inn.completed) || null;
      } else {
        this.currentInnings = null;
      }
    });
  }
  
  getTeamName(teamId: string): string {
    const team = this.cricketDataService.getTeamById(teamId);
    return team ? team.name : 'Unknown Team';
  }
  
  formatOvers(overs: number): string {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  }
  
  getMatchResult(): string {
    if (!this.match || !this.match.result) return '';
    
    if (this.match.result === 'tie') {
      return 'Match Tied';
    }
    
    const winningTeam = this.getTeamName(this.match.result);
    const teamAInnings = this.match.innings.find(inn => inn.battingTeam === this.match?.teamA);
    const teamBInnings = this.match.innings.find(inn => inn.battingTeam === this.match?.teamB);
    
    if (!teamAInnings || !teamBInnings) return `${winningTeam} won`;
    
    const runDifference = Math.abs(teamAInnings.totalRuns - teamBInnings.totalRuns);
    
    if (this.match.result === this.match.teamA && teamAInnings.battingTeam === this.match.teamA) {
      return `${winningTeam} won by ${runDifference} runs`;
    } else if (this.match.result === this.match.teamB && teamBInnings.battingTeam === this.match.teamB) {
      return `${winningTeam} won by ${runDifference} runs`;
    } else {
      const wicketsRemaining = 10 - (this.match.result === this.match.teamA ? teamAInnings.wickets : teamBInnings.wickets);
      return `${winningTeam} won by ${wicketsRemaining} wickets`;
    }
  }
  
  setActiveTab(tab: 'live' | 'scorecard'): void {
    this.activeTab = tab;
  }
}