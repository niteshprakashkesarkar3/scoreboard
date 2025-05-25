import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Stadium } from '../../models/stadium.model';
import { StadiumService } from '../../services/stadium.service';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="stadium-list-container">
      <div class="header">
        <h2>Stadiums</h2>
        <button class="add-button" routerLink="/stadiums/add">Add Stadium</button>
      </div>

      <div class="table-container">
        <table class="stadium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let stadium of stadiums">
              <td>{{ stadium.id }}</td>
              <td>{{ stadium.name }}</td>
              <td>{{ stadium.address }}</td>
              <td>{{ stadium.city }}</td>
              <td>{{ stadium.state }}</td>
              <td>{{ stadium.country }}</td>
              <td>{{ stadium.latitude }}, {{ stadium.longitude }}</td>
              <td class="actions">
                <button class="edit-button" (click)="onEdit(stadium)">Edit</button>
                <button class="delete-button" (click)="onDelete(stadium.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .stadium-list-container {
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .add-button {
      padding: 0.5rem 1rem;
      background-color: #1B5E20;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .stadium-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
      white-space: nowrap;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
      position: sticky;
      top: 0;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-button, .delete-button {
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .edit-button {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .delete-button {
      background-color: #ffebee;
      color: #c62828;
    }

    @media (max-width: 768px) {
      .stadium-list-container {
        padding: 1rem;
      }

      .stadium-table {
        font-size: 0.875rem;
      }

      th, td {
        padding: 0.75rem;
      }
    }
  `]
})
export class StadiumListComponent implements OnInit {
  stadiums: Stadium[] = [];

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