import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Group } from '../../models/group.model';
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
        [data]="groups"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  
  columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'tournamentId', header: 'Tournament' }
  ];

  constructor(
    private groupService: GroupService,
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupService.groups$.subscribe(groups => {
      this.groups = groups;
    });
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