import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-tournament-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FormLayoutComponent, 
    FormFieldComponent,
    InputComponent,
    SelectComponent
  ],
  template: `
    <form #tournamentForm="ngForm">
      <app-form-layout
        itemName="Tournament"
        [isEditMode]="isEditMode"
        [submitDisabled]="!tournamentForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Tournament ID"
          [showError]="!!(id.invalid && (id.dirty || id.touched))"
          errorMessage="Tournament ID is required"
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="tournament.id"
            [required]="true"
            [readonly]="isEditMode"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="name"
          label="Tournament Name"
          [showError]="!!(name.invalid && (name.dirty || name.touched))"
          errorMessage="Tournament name is required"
        >
          <app-input
            id="name"
            name="name"
            [(ngModel)]="tournament.name"
            [required]="true"
            #name="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="startDate"
          label="Start Date"
          [showError]="!!(startDate.invalid && (startDate.dirty || startDate.touched))"
          errorMessage="Start date is required"
        >
          <app-input
            type="date"
            id="startDate"
            name="startDate"
            [(ngModel)]="tournament.startDate"
            [required]="true"
            #startDate="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="endDate"
          label="End Date"
          [showError]="!!(endDate.invalid && (endDate.dirty || endDate.touched))"
          errorMessage="End date is required"
        >
          <app-input
            type="date"
            id="endDate"
            name="endDate"
            [(ngModel)]="tournament.endDate"
            [required]="true"
            #endDate="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="status"
          label="Status"
          [showError]="!!(status.invalid && (status.dirty || status.touched))"
          errorMessage="Status is required"
        >
          <app-select
            id="status"
            name="status"
            [(ngModel)]="tournament.status"
            [required]="true"
            placeholder="Select Status"
            #status="ngModel"
          >
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="played">Played</option>
            <option value="cancelled">Cancelled</option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class TournamentFormComponent implements OnInit {
  @ViewChild('tournamentForm') tournamentForm!: NgForm;

  tournament: Tournament = {
    id: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'scheduled'
  };

  isEditMode = false;

  constructor(
    private tournamentService: TournamentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tournamentService.tournaments$.subscribe(tournaments => {
        const tournament = tournaments.find(t => t.id === id);
        if (tournament) {
          this.tournament = { ...tournament };
        } else {
          this.router.navigate(['/tournaments']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      if (this.isEditMode) {
        this.tournamentService.updateTournament(this.tournament);
      } else {
        this.tournamentService.addTournament(this.tournament);
      }
      this.router.navigate(['/tournaments']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/tournaments']);
  }
}