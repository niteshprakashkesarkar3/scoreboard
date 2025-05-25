import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.clickable]="clickable">
      <h3 *ngIf="title">{{ title }}</h3>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      flex: 0 0 300px;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #eee;
      background: white;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card.clickable {
      cursor: pointer;
    }

    .card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #1B5E20;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .card {
        flex: 0 0 250px;
      }
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() clickable = true;
}