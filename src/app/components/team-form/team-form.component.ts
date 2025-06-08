import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Team } from '../../models/team.model';
import { Tournament } from '../../models/tournament.model';
import { Group } from '../../models/group.model';
import { TeamService } from '../../services/team.service';
import { TournamentService } from '../../services/tournament.service';
import { GroupService } from '../../services/group.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';
import { SelectComponent } from '../shared/select/select.component';

@Component({
  selector: 'app-team-form',
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
    <form #teamForm="ngForm">
      <app-form-layout
        itemName="Team"
        [isEditMode]="isEditMode"
        [submitDisabled]="!teamForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Team ID"
          [showError]="false"
          errorMessage=""
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="team.id"
            [readonly]="true"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="name"
          label="Team Name"
          [showError]="!!(name.invalid && (name.dirty || name.touched))"
          errorMessage="Team name is required"
        >
          <app-input
            id="name"
            name="name"
            [(ngModel)]="team.name"
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
            [(ngModel)]="team.tournamentId"
            [required]="true"
            placeholder="Select Tournament"
            (ngModelChange)="onTournamentChange()"
            #tournamentId="ngModel"
          >
            <option *ngFor="let tournament of tournaments" [value]="tournament.id">
              {{ tournament.name }}
            </option>
          </app-select>
        </app-form-field>

        <app-form-field
          id="groupId"
          label="Group"
          [showError]="!!(groupId.invalid && (groupId.dirty || groupId.touched))"
          errorMessage="Group is required"
        >
          <app-select
            id="groupId"
            name="groupId"
            [(ngModel)]="team.groupId"
            [required]="true"
            placeholder="Select Group"
            #groupId="ngModel"
          >
            <option *ngFor="let group of availableGroups" [value]="group.id">
              {{ group.name }}
            </option>
          </app-select>
        </app-form-field>
      </app-form-layout>
    </form>
  `
})
export class TeamFormComponent implements OnInit {
  @ViewChild('teamForm') teamForm!: NgForm;

  team: Team = {
    id: Date.now().toString(),
    name: '',
    tournamentId: '',
    groupId: ''
  };

  tournaments: Tournament[] = [];
  availableGroups: Group[] = [];
  isEditMode = false;

  constructor(
    private teamService: TeamService,
    private tournamentService: TournamentService,
    private groupService: GroupService,
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
      this.teamService.teams$.subscribe(teams => {
        const team = teams.find(t => t.id === id);
        if (team) {
          this.team = { ...team };
          this.onTournamentChange();
        } else {
          this.router.navigate(['/teams']);
        }
      });
    }
  }

  onTournamentChange(): void {
    if (this.team.tournamentId) {
      this.groupService.getGroupsByTournament(this.team.tournamentId).subscribe(groups => {
        this.availableGroups = groups;
        if (!this.isEditMode) {
          this.team.groupId = '';
        }
      });
    } else {
      this.availableGroups = [];
      this.team.groupId = '';
    }
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      if (this.isEditMode) {
        this.teamService.updateTeam(this.team);
      } else {
        this.teamService.addTeam(this.team);
      }
      this.router.navigate(['/teams']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/teams']);
  }
}