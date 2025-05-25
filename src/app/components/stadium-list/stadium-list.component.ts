import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Stadium } from '../../models/stadium.model';
import { StadiumService } from '../../services/stadium.service';
import { ListLayoutComponent } from '../shared/list-layout/list-layout.component';
import { TableComponent, TableColumn } from '../shared/table/table.component';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, ListLayoutComponent, TableComponent],
  template: `
    <app-list-layout
      title="Stadiums"
      itemName="Stadium"
      addRoute="/stadiums/add"
    >
      <app-table
        [columns]="columns"
        [data]="stadiums"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event.id)"
      ></app-table>
    </app-list-layout>
  `
})
export class StadiumListComponent implements OnInit {
  stadiums: Stadium[] = [];
  
  columns: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address' },
    { key: 'city', header: 'City' },
    { key: 'state', header: 'State' },
    { key: 'country', header: 'Country' }
  ];

  constructor(
    private stadiumService: StadiumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stadiumService.stadiums$.subscribe(stadiums => {
      this.stadiums = stadiums;
    });
  }

  onEdit(stadium: Stadium): void {
    this.router.navigate(['/stadiums/edit', stadium.id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this stadium?')) {
      this.stadiumService.deleteStadium(id);
    }
  }
}