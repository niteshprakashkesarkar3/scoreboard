import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CricketDataService } from '../../services/cricket-data.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group-container">
      <table class="standings-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>M</th>
            <th>W</th>
            <th>L</th>
            <th>T</th>
            <th>Pts</th>
            <th>NRR</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let team of teams" class="team-row">
            <td class="team-name">{{ team.name }}</td>
            <td>{{ team.matches }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.tied }}</td>
            <td class="points">{{ team.points }}</td>
            <td>{{ team.netRunRate | number:'1.3-3' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .group-container {
      width: 100%;
    }
    
    .standings-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Courier New', monospace;
      background-color: white;
      border-radius: 4px;
      overflow: hidden;
    }
    
    th, td {
      padding: 0.75rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background-color: #1B5E20;
      color: white;
      font-weight: bold;
    }
    
    .team-name {
      text-align: left;
      font-weight: 500;
    }
    
    .points {
      font-weight: bold;
    }
    
    .team-row:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class GroupComponent implements OnInit {
  @Input() group!: 'G1' | 'G2';
  teams: Team[] = [];
  
  constructor(private cricketDataService: CricketDataService) {}
  
  ngOnInit(): void {
    this.cricketDataService.teams$.subscribe(allTeams => {
      this.teams = allTeams
        .filter(team => team.group === this.group)
        .sort((a, b) => {
          // Sort by points (descending)
          if (b.points !== a.points) return b.points - a.points;
          // Then by net run rate (descending)
          return b.netRunRate - a.netRunRate;
        });
    });
  }
}