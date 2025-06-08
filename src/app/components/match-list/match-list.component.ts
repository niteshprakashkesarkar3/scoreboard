import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Stadium } from '../../models/stadium.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { StadiumService } from '../../services/stadium.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent, ButtonComponent],
  template: `
    <app-list-layout
      title="Matches"
      itemName="Match"
      addRoute="/matches/add"
    >
      <app-table
        [columns]="columns"
        [data]="transformedMatches"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      >
        <ng-template #actionButtons let-item>
          <app-button 
            variant="primary" 
            (onClick)="startMatch(item)"
            *ngIf="item.status === 'scheduled'"
          >
            Start Match Setup
          </app-button>
          <app-button 
            variant="primary" 
            (onClick)="continueMatch(item)"
            *ngIf="item.status === 'in_progress'"
          >
            Continue Match
          </app-button>
        </ng-template>
      </app-table>
    </app-list-layout>
  `
})
export class MatchListComponent implements OnInit {
  matches: Match[] = [];
  teams: Team[] = [];
  tournaments: Tournament[] = [];
  stadiums: Stadium[] = [];
  transformedMatches: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'tournament_id', header: 'Tournament' },
    { key: 'team1_id', header: 'Team 1' },
    { key: 'team2_id', header: 'Team 2' },
    { key: 'stadium_id', header: 'Stadium' },
    { key: 'scheduled_at', header: 'Scheduled At', type: 'date', format: 'medium' },
    { key: 'status', header: 'Status', type: 'status' }
  ];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private stadiumService: StadiumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.matchService.matches$,
      this.teamService.teams$,
      this.tournamentService.tournaments$,
      this.stadiumService.stadiums$
    ]).subscribe(([matches, teams, tournaments, stadiums]) => {
      this.matches = matches;
      this.teams = teams;
      this.tournaments = tournaments;
      this.stadiums = stadiums;
      this.updateTransformedMatches();
    });
  }

  updateTransformedMatches(): void {
    this.transformedMatches = this.matches.map(match => ({
      ...match,
      team1_id: this.getTeamName(match.team1_id),
      team2_id: this.getTeamName(match.team2_id),
      tournament_id: this.getTournamentName(match.tournament_id),
      stadium_id: this.getStadiumName(match.stadium_id)
    }));
  }

  getTeamName(id: string): string {
    const team = this.teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
  }

  getTournamentName(id: string): string {
    const tournament = this.tournaments.find(t => t.id === id);
    return tournament ? tournament.name : 'Unknown Tournament';
  }

  getStadiumName(id: string): string {
    const stadium = this.stadiums.find(s => s.id === id);
    return stadium ? stadium.name : 'Unknown Stadium';
  }

  onEdit(match: Match): void {
    this.router.navigate(['/matches/edit', match.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchService.deleteMatch(id);
    }
  }

  startMatch(match: Match): void {
    this.router.navigate(['/matches', match.id, 'setup']);
  }

  continueMatch(match: Match): void {
    this.router.navigate(['/matches', match.id, 'scoring']);
  }
}