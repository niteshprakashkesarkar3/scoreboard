import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '../../models/group.model';
import { Tournament } from '../../models/tournament.model';
import { GroupService } from '../../services/group.service';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="group-form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Group</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Group ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="group.id" 
            required
            [readonly]="isEditMode"
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Group ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="name">Group Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="group.name" 
            required
            #name="ngModel">
          <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
            Group name is required
          </div>
        </div>

        <div class="form-group">
          <label for="tournamentId">Tournament</label>
          <select 
            id="tournamentId" 
            name="tournamentId" 
            [(ngModel)]="group.tournamentId" 
            required
            #tournamentId="ngModel">
            <option value="">Select Tournament</option>
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
          <div class="error" *ngIf="tournamentId.invalid && (tournamentId.dirty || tournamentId.touched)">
            Tournament is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">{{ isEditMode ? 'Update' : 'Save' }} Group</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .group-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input[readonly] {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    button[type="submit"] {
      background-color: #1B5E20;
      color: white;
    }

    button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button[type="button"] {
      background-color: #f5f5f5;
      color: #333;
    }
  `]
})
export class GroupFormComponent implements OnInit {
  group: Group = {
    id: '',
    name: '',
    tournamentId: ''
  };

  tournaments: Tournament[] = [];
  isEditMode = false;

  constructor(
    private groupService: GroupService,
    private tournamentService: TournamentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tournamentService.tournaments$.subscribe(tournaments => {
      this.tournaments = tournaments;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.groupService.groups$.subscribe(groups => {
        const group = groups.find(g => g.id === id);
        if (group) {
          this.group = { ...group };
        } else {
          this.router.navigate(['/groups']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.groupService.updateGroup(this.group);
    } else {
      this.groupService.addGroup(this.group);
    }
    this.router.navigate(['/groups']);
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }
}