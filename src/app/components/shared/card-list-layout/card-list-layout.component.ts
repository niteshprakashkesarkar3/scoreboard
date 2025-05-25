import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-card-list-layout',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="card-list-section">
      <div class="section-header">
        <h2>{{ title }}</h2>
        <app-button variant="primary" (onClick)="onViewAll.emit()">
          View All
        </app-button>
      </div>
      <div class="cards-scroll-container">
        <div class="cards-container">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .card-list-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h2 {
      margin: 0;
      color: #1B5E20;
    }

    .cards-scroll-container {
      margin: 0 -1.5rem;
      padding: 0 1.5rem;
    }

    .cards-container {
      display: flex;
      overflow-x: auto;
      gap: 1rem;
      padding: 0.5rem 0;
      margin-bottom: -17px;
      scroll-behavior: smooth;
      height: fit-content;
    }

    .cards-container::-webkit-scrollbar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
    }

    .cards-container::-webkit-scrollbar-thumb {
      background: rgba(27, 94, 32, 0.5);
      border-radius: 4px;
      scrollbar-color: rgba(27, 94, 32, 0.5); 
    }

    .cards-container::-webkit-scrollbar-thumb:hover {
      background: #154c1a;
    }
  `]
})
export class CardListLayoutComponent {
  @Input() title = '';
  @Output() onViewAll = new EventEmitter<void>();
}