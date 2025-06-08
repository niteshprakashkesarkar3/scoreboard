import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Group } from '../../models/group.model';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { GroupService } from '../../services/group.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent],
  template: `
    <app-list-layout
      title="Teams"
      itemName="Team"
      addRoute="/teams/add"
    >
      <app-table
        [columns]="columns"
        [data]="transformedTeams"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  tournaments: Tournament[] = [];
  groups: Group[] = [];
  transformedTeams: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'tournamentId', header: 'Tournament' },
    { key: 'groupId', header: 'Group' }
  ];

  constructor(
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.teamService.teams$,
      this.tournamentService.tournaments$,
      this.groupService.groups$
    ]).subscribe(([teams, tournaments, groups]) => {
      this.teams = teams;
      this.tournaments = tournaments;
      this.groups = groups;
      this.updateTransformedTeams();
    });
  }

  updateTransformedTeams(): void {
    this.transformedTeams = this.teams.map(team => ({
      ...team,
      tournamentId: this.getTournamentName(team.tournamentId),
      groupId: this.getGroupName(team.groupId)
    }));
  }

  getTournamentName(id: string): string {
    const tournament = this.tournaments.find(t => t.id === id);
    return tournament ? tournament.name : 'Unknown Tournament';
  }

  getGroupName(id: string): string {
    const group = this.groups.find(g => g.id === id);
    return group ? group.name : 'Unknown Group';
  }

  onEdit(team: Team): void {
    this.router.navigate(['/teams/edit', team.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamService.deleteTeam(id);
    }
  }
}