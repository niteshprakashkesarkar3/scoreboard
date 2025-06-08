import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Group } from '../../models/group.model';
import { Tournament } from '../../models/tournament.model';
import { GroupService } from '../../services/group.service';
import { TournamentService } from '../../services/tournament.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent],
  template: `
    <app-list-layout
      title="Groups"
      itemName="Group"
      addRoute="/groups/add"
    >
      <app-table
        [columns]="columns"
        [data]="transformedGroups"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  tournaments: Tournament[] = [];
  transformedGroups: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'tournamentId', header: 'Tournament' }
  ];

  constructor(
    private groupService: GroupService,
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.groupService.groups$,
      this.tournamentService.tournaments$
    ]).subscribe(([groups, tournaments]) => {
      this.groups = groups;
      this.tournaments = tournaments;
      this.updateTransformedGroups();
    });
  }

  updateTransformedGroups(): void {
    this.transformedGroups = this.groups.map(group => ({
      ...group,
      tournamentId: this.getTournamentName(group.tournamentId)
    }));
  }

  getTournamentName(id: string): string {
    const tournament = this.tournaments.find(t => t.id === id);
    return tournament ? tournament.name : 'Unknown Tournament';
  }

  onEdit(group: Group): void {
    this.router.navigate(['/groups/edit', group.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groupService.deleteGroup(id);
    }
  }
}