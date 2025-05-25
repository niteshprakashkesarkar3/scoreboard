import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CricketDataService } from '../../services/cricket-data.service';
import { Player, Team } from '../../models/team.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="player-stats-container">
      <h2>Player Statistics</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label for="teamFilter">Team</label>
          <select id="teamFilter" [(ngModel)]="selectedTeamId" (change)="filterPlayers()">
            <option value="all">All Teams</option>
            <option *ngFor="let team of teams" [value]="team.id">{{ team.name }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="roleFilter">Role</label>
          <select id="roleFilter" [(ngModel)]="selectedRole" (change)="filterPlayers()">
            <option value="all">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="statType">Statistics</label>
          <select id="statType" [(ngModel)]="selectedStatType" (change)="filterPlayers()">
            <option value="batting">Batting</option>
            <option value="bowling">Bowling</option>
          </select>
        </div>
      </div>
      
      <div class="stats-tables">
        <table *ngIf="selectedStatType === 'batting'" class="stats-table batting-table">
          <thead>
            <tr>
              <th class="player-name">Player</th>
              <th>Team</th>
              <th>M</th>
              <th>I</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>HS</th>
              <th>Avg</th>
              <th>SR</th>
              <th>50s</th>
              <th>100s</th>
              <th>4s</th>
              <th>6s</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let player of filteredPlayers" 
                [class.highlighted]="isHighlightedPlayer(player)">
              <td class="player-name">{{ player.name }}</td>
              <td>{{ getTeamShortName(player.teamId) }}</td>
              <td>{{ player.battingStats.matches }}</td>
              <td>{{ player.battingStats.innings }}</td>
              <td>{{ player.battingStats.runs }}</td>
              <td>{{ player.battingStats.balls }}</td>
              <td>{{ player.battingStats.highestScore }}</td>
              <td>{{ calculateBattingAverage(player) | number:'1.2-2' }}</td>
              <td>{{ player.battingStats.strikeRate | number:'1.2-2' }}</td>
              <td>{{ player.battingStats.fifties }}</td>
              <td>{{ player.battingStats.hundreds }}</td>
              <td>{{ player.battingStats.fours }}</td>
              <td>{{ player.battingStats.sixes }}</td>
            </tr>
          </tbody>
        </table>
        
        <table *ngIf="selectedStatType === 'bowling'" class="stats-table bowling-table">
          <thead>
            <tr>
              <th class="player-name">Player</th>
              <th>Team</th>
              <th>M</th>
              <th>I</th>
              <th>O</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
              <th>Avg</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let player of filteredPlayers" 
                [class.highlighted]="isHighlightedPlayer(player)">
              <td class="player-name">{{ player.name }}</td>
              <td>{{ getTeamShortName(player.teamId) }}</td>
              <td>{{ player.bowlingStats.matches }}</td>
              <td>{{ player.bowlingStats.innings }}</td>
              <td>{{ formatOvers(player.bowlingStats.overs) }}</td>
              <td>{{ player.bowlingStats.runs }}</td>
              <td>{{ player.bowlingStats.wickets }}</td>
              <td>{{ player.bowlingStats.economy | number:'1.2-2' }}</td>
              <td>{{ calculateBowlingAverage(player) | number:'1.2-2' }}</td>
              <td>{{ player.bowlingStats.bestBowling }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .player-stats-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    h2 {
      color: #1B5E20;
      margin-bottom: 1.5rem;
    }
    
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      background-color: #1b5e1f;
      padding: 1rem;
      border-radius: 8px;
      color: white;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    
    .filter-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .filter-group select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      min-width: 150px;
    }
    
    .stats-tables {
      overflow-x: auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .stats-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 0.75rem 0.5rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #1B5E20;
      color: white;
      font-weight: bold;
      position: sticky;
      top: 0;
    }
    
    .player-name {
      text-align: left;
      min-width: 150px;
    }
    
    tr.highlighted {
      background-color: #e8f5e9;
    }
    
    tr:hover {
      background-color: #f5f5f5;
    }
    
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }
      
      .filter-group {
        width: 100%;
      }
    }
  `]
})
export class PlayerStatsComponent implements OnInit {
  teams: Team[] = [];
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  
  selectedTeamId: string = 'all';
  selectedRole: string = 'all';
  selectedStatType: 'batting' | 'bowling' = 'batting';
  
  constructor(private cricketDataService: CricketDataService) {}
  
  ngOnInit(): void {
    this.cricketDataService.teams$.subscribe(teams => {
      this.teams = teams;
      this.allPlayers = teams.flatMap(team => team.players);
      this.filterPlayers();
    });
  }
  
  filterPlayers(): void {
    // First filter by team
    let filtered = this.allPlayers;
    
    if (this.selectedTeamId !== 'all') {
      filtered = filtered.filter(player => player.teamId === this.selectedTeamId);
    }
    
    // Then by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(player => player.role === this.selectedRole);
    }
    
    // Then by stat type (only show relevant players)
    if (this.selectedStatType === 'batting') {
      // For batting, show all players but sort by runs
      filtered.sort((a, b) => b.battingStats.runs - a.battingStats.runs);
    } else {
      // For bowling, filter out pure batsmen and sort by wickets
      filtered = filtered.filter(p => p.role !== 'Batsman');
      filtered.sort((a, b) => b.bowlingStats.wickets - a.bowlingStats.wickets);
    }
    
    this.filteredPlayers = filtered;
  }
  
  getTeamShortName(teamId: string): string {
    const team = this.cricketDataService.getTeamById(teamId);
    return team ? team.shortName : 'UNK';
  }
  
  formatOvers(overs: number): string {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  }
  
  calculateBattingAverage(player: Player): number {
    const innings = player.battingStats.innings - player.battingStats.notOuts;
    return innings > 0 ? player.battingStats.runs / innings : player.battingStats.runs;
  }
  
  calculateBowlingAverage(player: Player): number {
    return player.bowlingStats.wickets > 0 ? 
      player.bowlingStats.runs / player.bowlingStats.wickets : 
      player.bowlingStats.runs;
  }
  
  isHighlightedPlayer(player: Player): boolean {
    if (this.selectedStatType === 'batting') {
      return player.battingStats.runs > 50;
    } else {
      return player.bowlingStats.wickets > 2;
    }
  }
}