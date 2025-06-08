import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent],
  template: `
    <app-list-layout
      title="Tournaments"
      itemName="Tournament"
      addRoute="/tournaments/add"
    >
      <app-table
        [columns]="columns"
        [data]="tournaments"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'startDate', header: 'Start Date', type: 'date' },
    { key: 'endDate', header: 'End Date', type: 'date' },
    { key: 'status', header: 'Status', type: 'status' }
  ];

  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournamentService.tournaments$.subscribe(tournaments => {
      this.tournaments = tournaments;
    });
  }

  onEdit(tournament: Tournament): void {
    this.router.navigate(['/tournaments/edit', tournament.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this tournament?')) {
      this.tournamentService.deleteTournament(id);
    }
  }
}