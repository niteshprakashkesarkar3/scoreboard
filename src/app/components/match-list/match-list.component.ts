import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Match } from '../../models/match.model';
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
        [data]="matches"
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
  
  columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
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
    this.matchService.matches$.subscribe(matches => {
      this.matches = matches;
    });
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