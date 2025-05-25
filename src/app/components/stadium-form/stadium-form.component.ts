import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Stadium } from '../../models/stadium.model';
import { StadiumService } from '../../services/stadium.service';
import { FormLayoutComponent } from '../shared/form-layout/form-layout.component';
import { FormFieldComponent } from '../shared/form-field/form-field.component';
import { InputComponent } from '../shared/input/input.component';

@Component({
  selector: 'app-stadium-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    FormLayoutComponent, 
    FormFieldComponent,
    InputComponent
  ],
  template: `
    <form #stadiumForm="ngForm">
      <app-form-layout
        itemName="Stadium"
        [isEditMode]="isEditMode"
        [submitDisabled]="!stadiumForm.form.valid"
        (onSubmit)="onSubmit()"
        (onCancel)="onCancel()"
      >
        <app-form-field
          id="id"
          label="Stadium ID"
          [showError]="!!(id.invalid && (id.dirty || id.touched))"
          errorMessage="Stadium ID is required"
        >
          <app-input
            id="id"
            name="id"
            [(ngModel)]="stadium.id"
            [required]="true"
            [readonly]="isEditMode"
            #id="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="name"
          label="Stadium Name"
          [showError]="!!(name.invalid && (name.dirty || name.touched))"
          errorMessage="Stadium name is required"
        >
          <app-input
            id="name"
            name="name"
            [(ngModel)]="stadium.name"
            [required]="true"
            #name="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="address"
          label="Address"
          [showError]="!!(address.invalid && (address.dirty || address.touched))"
          errorMessage="Address is required"
        >
          <app-input
            id="address"
            name="address"
            [(ngModel)]="stadium.address"
            [required]="true"
            #address="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="city"
          label="City"
          [showError]="!!(city.invalid && (city.dirty || city.touched))"
          errorMessage="City is required"
        >
          <app-input
            id="city"
            name="city"
            [(ngModel)]="stadium.city"
            [required]="true"
            #city="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="state"
          label="State"
          [showError]="!!(state.invalid && (state.dirty || state.touched))"
          errorMessage="State is required"
        >
          <app-input
            id="state"
            name="state"
            [(ngModel)]="stadium.state"
            [required]="true"
            #state="ngModel"
          ></app-input>
        </app-form-field>

        <app-form-field
          id="country"
          label="Country"
          [showError]="!!(country.invalid && (country.dirty || country.touched))"
          errorMessage="Country is required"
        >
          <app-input
            id="country"
            name="country"
            [(ngModel)]="stadium.country"
            [required]="true"
            #country="ngModel"
          ></app-input>
        </app-form-field>

        <div class="form-row">
          <app-form-field
            id="latitude"
            label="Latitude"
            [showError]="!!(latitude.invalid && (latitude.dirty || latitude.touched))"
            errorMessage="Latitude is required"
          >
            <app-input
              type="number"
              id="latitude"
              name="latitude"
              [(ngModel)]="stadium.latitude"
              [required]="true"
              step="any"
              #latitude="ngModel"
            ></app-input>
          </app-form-field>

          <app-form-field
            id="longitude"
            label="Longitude"
            [showError]="!!(longitude.invalid && (longitude.dirty || longitude.touched))"
            errorMessage="Longitude is required"
          >
            <app-input
              type="number"
              id="longitude"
              name="longitude"
              [(ngModel)]="stadium.longitude"
              [required]="true"
              step="any"
              #longitude="ngModel"
            ></app-input>
          </app-form-field>
        </div>
      </app-form-layout>
    </form>
  `,
  styles: [`
    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row app-form-field {
      flex: 1;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class StadiumFormComponent implements OnInit {
  @ViewChild('stadiumForm') stadiumForm!: NgForm;

  stadium: Stadium = {
    id: '',
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    latitude: 0,
    longitude: 0
  };

  isEditMode = false;

  constructor(
    private stadiumService: StadiumService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stadiumService.stadiums$.subscribe(stadiums => {
        const stadium = stadiums.find(s => s.id === id);
        if (stadium) {
          this.stadium = { ...stadium };
        } else {
          this.router.navigate(['/stadiums']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.stadiumForm.valid) {
      if (this.isEditMode) {
        this.stadiumService.updateStadium(this.stadium);
      } else {
        this.stadiumService.addStadium(this.stadium);
      }
      this.router.navigate(['/stadiums']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/stadiums']);
  }
}