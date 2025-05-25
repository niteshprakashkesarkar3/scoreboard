import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-list-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="list-container">
      <div class="header">
        <h2>{{ title }}</h2>
        <app-button variant="primary" [routerLink]="addRoute">
          Add {{ itemName }}
        </app-button>
      </div>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
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

    .header h2 {
      margin: 0;
      color: #1B5E20;
    }

    .content {
      width: 100%;
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      .list-container {
        padding: 1rem;
      }
    }
  `]
})
export class ListLayoutComponent {
  @Input() title = '';
  @Input() itemName = '';
  @Input() addRoute = '';
}