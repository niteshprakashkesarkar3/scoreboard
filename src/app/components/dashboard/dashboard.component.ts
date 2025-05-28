import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { StadiumService } from '../../services/stadium.service';
import { GroupService } from '../../services/group.service';
import { CardComponent } from '../shared/card/card.component';
import { CardListLayoutComponent } from '../shared/card-list-layout/card-list-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, CardListLayoutComponent],
  template: `
    <div class="dashboard-container">
      <app-card-list-layout
        title="Live Matches"
        (onViewAll)="navigateTo('/matches')"
      >
        <app-card
          *ngFor="let match of liveMatches"
          (click)="navigateToMatch(match)"
        >
          <div class="teams">
            <span>{{ getTeamName(match.team1_id) }}</span>
            <span class="vs">vs</span>
            <span>{{ getTeamName(match.team2_id) }}</span>
          </div>
          <p class="venue">{{ getStadiumName(match.stadium_id) }}</p>
          <p class="date">{{ match.scheduled_at | date:'medium' }}</p>
          <span class="status-badge in_progress">Live</span>
        </app-card>
      </app-card-list-layout>

      <app-card-list-layout
        title="Tournaments"
        (onViewAll)="navigateTo('/tournaments')"
      >
        <app-card
          *ngFor="let tournament of tournaments"
          [title]="tournament.name"
          (click)="navigateTo('/tournaments/edit/' + tournament.id)"
        >
          <p>{{ tournament.startDate | date }} - {{ tournament.endDate | date }}</p>
          <span class="status-badge" [class]="tournament.status">
            {{ tournament.status }}
          </span>
        </app-card>
      </app-card-list-layout>

      <app-card-list-layout
        title="Upcoming Matches"
        (onViewAll)="navigateTo('/matches')"
      >
        <app-card
          *ngFor="let match of upcomingMatches"
          (click)="navigateTo('/matches/edit/' + match.id)"
        >
          <div class="teams">
            <span>{{ getTeamName(match.team1_id) }}</span>
            <span class="vs">vs</span>
            <span>{{ getTeamName(match.team2_id) }}</span>
          </div>
          <p class="venue">{{ getStadiumName(match.stadium_id) }}</p>
          <p class="date">{{ match.scheduled_at | date:'medium' }}</p>
        </app-card>
      </app-card-list-layout>

      <app-card-list-layout
        title="Teams"
        (onViewAll)="navigateTo('/teams')"
      >
        <app-card
          *ngFor="let team of teams"
          [title]="team.name"
          (click)="navigateTo('/teams/edit/' + team.id)"
        >
          <p>Tournament: {{ getTournamentName(team.tournamentId) }}</p>
          <p>Group: {{ getGroupName(team.groupId) }}</p>
        </app-card>
      </app-card-list-layout>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
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

    .status-badge.in_progress {
      background-color: #ff5722;
      color: white;
      animation: pulse 1.5s infinite;
    }

    .teams {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      height: fit-content;
    }

    .vs {
      color: #666;
      font-size: 0.875rem;
      margin: 0 0.5rem;
    }

    .venue {
      color: #666;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .date {
      color: #1B5E20;
      font-weight: 500;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  tournaments: Tournament[] = [];
  matches: Match[] = [];
  teams: Team[] = [];
  liveMatches: Match[] = [];
  upcomingMatches: Match[] = [];

  constructor(
    private dashboardService: DashboardService,
    private stadiumService: StadiumService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.tournaments = data.tournaments;
      this.teams = data.teams;
      
      // Filter matches by status
      this.liveMatches = data.matches.filter(m => m.status === 'in_progress');
      this.upcomingMatches = data.matches.filter(m => m.status === 'scheduled');
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

  navigateToMatch(match: Match): void {
    this.router.navigate(['/matches', match.id, 'scoring']);
  }
}