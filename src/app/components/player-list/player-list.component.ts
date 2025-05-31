import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent],
  template: `
    <app-list-layout
      title="Players"
      itemName="Player"
      addRoute="/players/add"
    >
      <app-table
        [columns]="columns"
        [data]="transformedPlayers"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  teams: Team[] = [];
  transformedPlayers: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'roles', header: 'Roles' },
    { key: 'status', header: 'Status', type: 'status' },
    { key: 'teamId', header: 'Team' }
  ];

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.playerService.players$,
      this.teamService.teams$
    ]).subscribe(([players, teams]) => {
      this.players = players;
      this.teams = teams;
      this.updateTransformedPlayers();
    });
  }

  updateTransformedPlayers(): void {
    this.transformedPlayers = this.players.map(player => ({
      ...player,
      teamId: this.getTeamName(player.teamId)
    }));
  }

  getTeamName(id: string): string {
    const team = this.teams.find(t => t.id === id);
    return team ? team.name : 'Unknown Team';
  }

  onEdit(player: Player): void {
    this.router.navigate(['/players/edit', player.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id);
    }
  }
}