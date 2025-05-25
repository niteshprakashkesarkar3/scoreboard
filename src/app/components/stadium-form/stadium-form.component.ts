import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Stadium } from '../../models/stadium.model';
import { StadiumService } from '../../services/stadium.service';

@Component({
  selector: 'app-stadium-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stadium-form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Stadium</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="id">Stadium ID</label>
          <input 
            type="text" 
            id="id" 
            name="id" 
            [(ngModel)]="stadium.id" 
            required
            [readonly]="isEditMode"
            #id="ngModel">
          <div class="error" *ngIf="id.invalid && (id.dirty || id.touched)">
            Stadium ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="name">Stadium Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="stadium.name" 
            required
            #name="ngModel">
          <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
            Stadium name is required
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            [(ngModel)]="stadium.address" 
            required
            #address="ngModel">
          <div class="error" *ngIf="address.invalid && (address.dirty || address.touched)">
            Address is required
          </div>
        </div>

        <div class="form-group">
          <label for="city">City</label>
          <input 
            type="text" 
            id="city" 
            name="city" 
            [(ngModel)]="stadium.city" 
            required
            #city="ngModel">
          <div class="error" *ngIf="city.invalid && (city.dirty || city.touched)">
            City is required
          </div>
        </div>

        <div class="form-group">
          <label for="state">State</label>
          <input 
            type="text" 
            id="state" 
            name="state" 
            [(ngModel)]="stadium.state" 
            required
            #state="ngModel">
          <div class="error" *ngIf="state.invalid && (state.dirty || state.touched)">
            State is required
          </div>
        </div>

        <div class="form-group">
          <label for="country">Country</label>
          <input 
            type="text" 
            id="country" 
            name="country" 
            [(ngModel)]="stadium.country" 
            required
            #country="ngModel">
          <div class="error" *ngIf="country.invalid && (country.dirty || country.touched)">
            Country is required
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input 
              type="number" 
              id="latitude" 
              name="latitude" 
              [(ngModel)]="stadium.latitude" 
              required
              step="any"
              #latitude="ngModel">
            <div class="error" *ngIf="latitude.invalid && (latitude.dirty || latitude.touched)">
              Latitude is required
            </div>
          </div>

          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input 
              type="number" 
              id="longitude" 
              name="longitude" 
              [(ngModel)]="stadium.longitude" 
              required
              step="any"
              #longitude="ngModel">
            <div class="error" *ngIf="longitude.invalid && (longitude.dirty || longitude.touched)">
              Longitude is required
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid">{{ isEditMode ? 'Update' : 'Save' }} Stadium</button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .stadium-form-container {
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

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-row .form-group {
      flex: 1;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    input {
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

    input[type="number"] {
      -moz-appearance: textfield;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class StadiumFormComponent implements OnInit {
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
    if (this.isEditMode) {
      this.stadiumService.updateStadium(this.stadium);
    } else {
      this.stadiumService.addStadium(this.stadium);
    }
    this.router.navigate(['/stadiums']);
  }

  onCancel(): void {
    this.router.navigate(['/stadiums']);
  }
}