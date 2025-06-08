import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '../../models/group.model';
import { Tournament } from '../../models/tournament.model';
import { GroupService } from '../../services/group.service';
import { TournamentService } from '../../services/tournament.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-group-form',
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
    <form #groupForm="ngForm">
      <app-form-layout
        itemName="Group"
        [isEditMode]="isEditMode"
        [submitDisabled]="!groupForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Group ID"
          [showError]="false"
          errorMessage=""
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="group.id"
            [readonly]="true"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="name"
          label="Group Name"
          [showError]="!!(name.invalid && (name.dirty || name.touched))"
          errorMessage="Group name is required"
        >
          <app-input
            id="name"
            name="name"
            [(ngModel)]="group.name"
            [required]="true"
            #name="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="tournamentId"
          label="Tournament"
          [showError]="!!(tournamentId.invalid && (tournamentId.dirty || tournamentId.touched))"
          errorMessage="Tournament is required"
        >
          <app-select
            id="tournamentId"
            name="tournamentId"
            [(ngModel)]="group.tournamentId"
            [required]="true"
            placeholder="Select Tournament"
            #tournamentId="ngModel"
          >
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class GroupFormComponent implements OnInit {
  @ViewChild('groupForm') groupForm!: NgForm;

  group: Group = {
    id: Date.now().toString(),
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
    if (this.groupForm.valid) {
      if (this.isEditMode) {
        this.groupService.updateGroup(this.group);
      } else {
        this.groupService.addGroup(this.group);
      }
      this.router.navigate(['/groups']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }
}