import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { StadiumService } from '../../services/stadium.service';
import { GroupService } from '../../services/group.service';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="dashboard-container">
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Tournaments</h2>
          <app-button variant="primary" (onClick)="navigateTo('/tournaments')">
            View All
          </app-button>
        </div>
        <div class="cards-scroll-container">
          <div class="cards-container">
            <div *ngFor="let tournament of tournaments" class="card tournament-card">
              <h3>{{ tournament.name }}</h3>
              <div class="card-content">
                <p>{{ tournament.startDate | date }} - {{ tournament.endDate | date }}</p>
                <span class="status-badge" [class]="tournament.status"> 
                  {{ tournament.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <h2>Upcoming Matches</h2>
          <app-button variant="primary" (onClick)="navigateTo('/matches')">
            View All
          </app-button>
        </div>
        <div class="cards-scroll-container">
          <div class="cards-container">
            <div *ngFor="let match of matches" class="card match-card">
              <div class="card-content">
                <div class="teams">
                  <span>{{ getTeamName(match.team1_id) }}</span>
                  <span class="vs">vs</span>
                  <span>{{ getTeamName(match.team2_id) }}</span>
                </div>
                <p class="venue">{{ getStadiumName(match.stadium_id) }}</p>
                <p class="date">{{ match.scheduled_at | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <h2>Teams</h2>
          <app-button variant="primary" (onClick)="navigateTo('/teams')">
            View All
          </app-button>
        </div>
        <div class="cards-scroll-container">
          <div class="cards-container">
            <div *ngFor="let team of teams" class="card team-card">
              <h3>{{ team.name }}</h3>
              <div class="card-content">
                <p>Tournament: {{ getTournamentName(team.tournamentId) }}</p>
                <p>Group: {{ getGroupName(team.groupId) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .dashboard-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
      color: #1B5E20;
    }
 
    .cards-scroll-container {
      margin: 0 -1.5rem;
      padding: 0 1.5rem;
    }

    .cards-container {
      display: flex;
      overflow-x: auto;
      gap: 1rem;
      padding: 0.5rem 0;
      margin-bottom: -17px;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      height: fit-content;
    }

    .cards-container::-webkit-scrollbar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
    }

    .cards-container::-webkit-scrollbar-thumb {
      background: rgba(27, 94, 32, 0.5);
      border-radius: 4px;
      scrollbar-color: rgba(27, 94, 32, 0.5); 
    }

    .cards-container::-webkit-scrollbar-thumb:hover {
      background: #154c1a;
    }

    .card {
      flex: 0 0 300px;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #eee;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
      margin: 0 0 1rem 0;
      color: #1B5E20;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      text-transform: capitalize;
      width: fit-content;
    }

    .status-badge.scheduled {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.ongoing {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.played {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .match-card .teams {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      height: fit-content;
    }

    .match-card .vs {
      color: #666;
      font-size: 0.875rem;
      margin: 0 0.5rem;
    }

    .match-card .venue {
      color: #666;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .match-card .date {
      color: #1B5E20;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .card {
        flex: 0 0 250px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  tournaments: Tournament[] = [];
  matches: Match[] = [];
  teams: Team[] = [];

  constructor(
    private dashboardService: DashboardService,
    private stadiumService: StadiumService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.tournaments = data.tournaments;
      this.matches = data.matches;
      this.teams = data.teams;
    });
  }

  getTeamName(id: string): string {
    const team = this.teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
  }

  getTournamentName(id: string): string {
    const tournament = this.tournaments.find(t => t.id === id);
    return tournament ? tournament.name : 'Unknown Tournament';
  }

  getGroupName(id: string): string {
    let name = 'Unknown Group';
    this.groupService.groups$.subscribe(groups => {
      const group = groups.find(g => g.id === id);
      if (group) {
        name = group.name;
      }
    });
    return name;
  }

  getStadiumName(id: string): string {
    let name = 'Unknown Stadium';
    this.stadiumService.stadiums$.subscribe(stadiums => {
      const stadium = stadiums.find(s => s.id === id);
      if (stadium) {
        name = stadium.name;
      }
    });
    return name;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}