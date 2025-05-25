import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupComponent } from '../group/group.component';
import { CricketDataService } from '../../services/cricket-data.service';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { Player } from '../../models/team.model';

@Component({
  selector: 'app-tournament',
  standalone: true,
  imports: [CommonModule, GroupComponent],
  template: `
    <div class="tournament-container">
      <h1>Cricket Tournament Tracker</h1>
      
      <div class="groups-container">
        <div class="group">
          <h2>Group 1</h2>
          <app-group [group]="'G1'"></app-group>
        </div>
        
        <div class="group">
          <h2>Group 2</h2>
          <app-group [group]="'G2'"></app-group>
        </div>
      </div>
      
      <div class="matches-container">
        <h2>Matches</h2>
        <div class="match-list">
          <div *ngFor="let match of matches" class="match-card" 
               [class.live]="match.status === 'live'"
               [class.completed]="match.status === 'completed'"
               [class.upcoming]="match.status === 'upcoming'"
               (click)="selectMatch(match.id)">
            <div class="match-header">
              <span class="match-date">{{ match.date | date:'mediumDate' }}</span>
              <span class="match-venue">{{ match.venue }}</span>
              <span class="match-status" [ngClass]="match.status">{{ match.status }}</span>
            </div>
            
            <div class="teams">
              <div class="team team-a">
                <span class="team-name">{{ getTeamName(match.teamA) }}</span>
                <span class="team-score" *ngIf="getTeamScore(match, match.teamA) as score">
                  {{ score.runs }}/{{ score.wickets }} ({{ score.overs }})
                </span>
              </div>
              
              <div class="vs">VS</div>
              
              <div class="team team-b">
                <span class="team-name">{{ getTeamName(match.teamB) }}</span>
                <span class="team-score" *ngIf="getTeamScore(match, match.teamB) as score">
                  {{ score.runs }}/{{ score.wickets }} ({{ score.overs }})
                </span>
              </div>
            </div>
            
            <div class="match-result" *ngIf="match.result">
              {{ getMatchResult(match) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tournament-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    h1 {
      color: #1B5E20;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    .groups-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .group {
      flex: 1;
      min-width: 300px;
      background-color: #FFF8E1;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .matches-container {
      background-color: #FFF8E1;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .match-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .match-card {
      background-color: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .match-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .match-card.live {
      border-left: 4px solid #f44336;
    }
    
    .match-card.completed {
      border-left: 4px solid #4CAF50;
    }
    
    .match-card.upcoming {
      border-left: 4px solid #2196F3;
    }
    
    .match-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    .match-status {
      font-weight: bold;
      border-radius: 4px;
      padding: 2px 8px;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    
    .match-status.live {
      background-color: #ffcdd2;
      color: #d32f2f;
    }
    
    .match-status.completed {
      background-color: #c8e6c9;
      color: #2e7d32;
    }
    
    .match-status.upcoming {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .teams {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;
    }
    
    .team {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 45%;
    }
    
    .team-name {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    
    .team-score {
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
    
    .vs {
      font-weight: bold;
      color: #666;
    }
    
    .match-result {
      text-align: center;
      font-weight: bold;
      margin-top: 0.5rem;
      color: #1B5E20;
    }
    
    @media (max-width: 768px) {
      .groups-container {
        flex-direction: column;
      }
      
      .match-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TournamentComponent implements OnInit {
  matches: Match[] = [];
  
  constructor(private cricketDataService: CricketDataService) {}
  
  ngOnInit(): void {
    this.cricketDataService.matches$.subscribe(matches => {
      this.matches = matches;
    });
    
    this.initializeDemoData();
  }
  
  selectMatch(matchId: string): void {
    this.cricketDataService.setCurrentMatch(matchId);
  }
  
  getTeamName(teamId: string): string {
    const team = this.cricketDataService.getTeamById(teamId);
    return team ? team.name : 'Unknown Team';
  }
  
  getTeamScore(match: Match, teamId: string): { runs: number, wickets: number, overs: string } | null {
    const innings = match.innings.find(inn => inn.battingTeam === teamId);
    if (!innings) return null;
    
    const fullOvers = Math.floor(innings.overs);
    const balls = Math.round((innings.overs - fullOvers) * 10);
    
    return {
      runs: innings.totalRuns,
      wickets: innings.wickets,
      overs: `${fullOvers}.${balls}`
    };
  }
  
  getMatchResult(match: Match): string {
    if (!match.result) return '';
    
    if (match.result === 'tie') {
      return 'Match Tied';
    }
    
    const winningTeam = this.getTeamName(match.result);
    const teamAInnings = match.innings.find(inn => inn.battingTeam === match.teamA);
    const teamBInnings = match.innings.find(inn => inn.battingTeam === match.teamB);
    
    if (!teamAInnings || !teamBInnings) return `${winningTeam} won`;
    
    const runDifference = Math.abs(teamAInnings.totalRuns - teamBInnings.totalRuns);
    
    if (match.result === match.teamA && teamAInnings.battingTeam === match.teamA) {
      return `${winningTeam} won by ${runDifference} runs`;
    } else if (match.result === match.teamB && teamBInnings.battingTeam === match.teamB) {
      return `${winningTeam} won by ${runDifference} runs`;
    } else {
      const wicketsRemaining = 10 - (match.result === match.teamA ? teamAInnings.wickets : teamBInnings.wickets);
      return `${winningTeam} won by ${wicketsRemaining} wickets`;
    }
  }
  
  private initializeDemoData(): void {
    // Create teams with actual players
    const teams: Team[] = [
      {
        id: 'wp',
        name: 'Wakanda Panthers',
        shortName: 'WP',
        group: 'G1',
        players: [
          this.createPlayer('wp_1', 'Namdev Surwase', 'wp', 'All-rounder'),
          this.createPlayer('wp_2', 'Krushna Panchvishe', 'wp', 'All-rounder'),
          this.createPlayer('wp_3', 'Krunal Kamble', 'wp', 'All-rounder'),
          this.createPlayer('wp_4', 'Rahul Gadhe', 'wp', 'All-rounder'),
          this.createPlayer('wp_5', 'Makarand Bhale', 'wp', 'All-rounder'),
          this.createPlayer('wp_6', 'Sanjana Gaikwad', 'wp', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      },
      {
        id: 'wu',
        name: "Loki's Legions",
        shortName: 'WU',
        group: 'G2',
        players: [
          this.createPlayer('wu_1', 'Imran Shaikh', 'wu', 'All-rounder'),
          this.createPlayer('wu_2', 'Bhushan Sonawane', 'wu', 'All-rounder'),
          this.createPlayer('wu_3', 'Devender Malhotra', 'wu', 'All-rounder'),
          this.createPlayer('wu_4', 'Amol Shirole', 'wu', 'All-rounder'),
          this.createPlayer('wu_5', 'Shaif Ahmed', 'wu', 'All-rounder'),
          this.createPlayer('wu_6', 'Kajal Patil', 'wu', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      },
      {
        id: 'xw',
        name: 'X-Warriors',
        shortName: 'XW',
        group: 'G1',
        players: [
          this.createPlayer('xw_1', 'Anmol Sharma', 'xw', 'All-rounder'),
          this.createPlayer('xw_2', 'Amol Borole', 'xw', 'All-rounder'),
          this.createPlayer('xw_3', 'Arthesh Medhekar', 'xw', 'All-rounder'),
          this.createPlayer('xw_4', 'Rizwan Gazi', 'xw', 'All-rounder'),
          this.createPlayer('xw_5', 'Shruti Patil', 'xw', 'All-rounder'),
          this.createPlayer('xw_6', 'Anirudha Kadam', 'xw', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      },
      {
        id: 'js',
        name: 'Justice Strikers',
        shortName: 'JS',
        group: 'G1',
        players: [
          this.createPlayer('js_1', 'Shyam Panchvishe', 'js', 'All-rounder'),
          this.createPlayer('js_2', 'Saish Chinchalkar', 'js', 'All-rounder'),
          this.createPlayer('js_3', 'Mayuresh Koli', 'js', 'All-rounder'),
          this.createPlayer('js_4', 'Pawan Bhise', 'js', 'All-rounder'),
          this.createPlayer('js_5', 'Shreyas Ghare', 'js', 'All-rounder'),
          this.createPlayer('js_6', 'Sejal Agarwal', 'js', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      },
      {
        id: 'as',
        name: 'Avengers Squad',
        shortName: 'AS',
        group: 'G2',
        players: [
          this.createPlayer('as_1', 'Vikram Bhimannavar', 'as', 'All-rounder'),
          this.createPlayer('as_2', 'Nikita Belekar', 'as', 'All-rounder'),
          this.createPlayer('as_3', 'Avdhoot Patil', 'as', 'All-rounder'),
          this.createPlayer('as_4', 'Vaibhav Ayawale', 'as', 'All-rounder'),
          this.createPlayer('as_5', 'Mohit Mane', 'as', 'All-rounder'),
          this.createPlayer('as_6', 'Mukund R', 'as', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      },
      {
        id: 'gb',
        name: 'Guardian Blasters',
        shortName: 'GB',
        group: 'G2',
        players: [
          this.createPlayer('gb_1', 'Nitesh Kesarkar', 'gb', 'All-rounder'),
          this.createPlayer('gb_2', 'Akshay Shinde', 'gb', 'All-rounder'),
          this.createPlayer('gb_3', 'Nikhil Suryavanshi', 'gb', 'All-rounder'),
          this.createPlayer('gb_4', 'Satbeer Singh', 'gb', 'All-rounder'),
          this.createPlayer('gb_5', 'Sofiyan Pathan', 'gb', 'All-rounder'),
          this.createPlayer('gb_6', 'Jigna Parmar', 'gb', 'All-rounder')
        ],
        matches: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        netRunRate: 0
      }
    ];
    
    // Initialize tournament with teams
    this.cricketDataService.initializeTournament(teams);
    
    // Create matches
    const matches: Match[] = [
      {
        id: 'm1',
        date: new Date('2025-05-07'),
        venue: 'Main Stadium',
        teamA: 'wp',
        teamB: 'xw',
        tossWinner: 'wp',
        tossDecision: 'bat',
        status: 'upcoming',
        innings: []
      },
      {
        id: 'm2',
        date: new Date('2025-05-14'),
        venue: 'City Ground',
        teamA: 'xw',
        teamB: 'js',
        tossWinner: 'xw',
        tossDecision: 'bowl',
        status: 'upcoming',
        innings: []
      },
      {
        id: 'm3',
        date: new Date('2025-05-14'),
        venue: 'Sports Complex',
        teamA: 'wp',
        teamB: 'js',
        tossWinner: 'js',
        tossDecision: 'bat',
        status: 'upcoming',
        innings: []
      },
      {
        id: 'm4',
        date: new Date('2025-05-07'),
        venue: 'Central Park',
        teamA: 'as',
        teamB: 'gb',
        tossWinner: 'as',
        tossDecision: 'bat',
        status: 'upcoming',
        innings: []
      }
    ];
    
    // Add matches to the service
    matches.forEach(match => {
      this.cricketDataService.createMatch(match);
    });
  }
  
  private createPlayer(id: string, name: string, teamId: string, role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper'): Player {
    return {
      id,
      name,
      teamId,
      role,
      battingStats: {
        matches: 0,
        innings: 0,
        runs: 0,
        balls: 0,
        highestScore: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        hundreds: 0,
        fours: 0,
        sixes: 0,
        notOuts: 0
      },
      bowlingStats: {
        matches: 0,
        innings: 0,
        overs: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
        average: 0,
        bestBowling: '-',
        balls: 0
      }
    };
  }
}