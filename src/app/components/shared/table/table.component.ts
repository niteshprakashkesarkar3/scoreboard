import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'date' | 'status' | 'custom';
  format?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th *ngFor="let column of columns">{{ column.header }}</th>
            <th *ngIf="showActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of data">
            <td *ngFor="let column of columns">
              <ng-container [ngSwitch]="column.type">
                <ng-container *ngSwitchCase="'date'">
                  {{ item[column.key] | date:(column.format || 'mediumDate') }}
                </ng-container>
                <ng-container *ngSwitchCase="'status'">
                  <span class="status-badge" [class]="item[column.key]">
                    {{ item[column.key] }}
                  </span>
                </ng-container>
                <ng-container *ngSwitchDefault>
                  {{ item[column.key] }}
                </ng-container>
              </ng-container>
            </td>
            <td *ngIf="showActions" class="actions">
              <ng-container *ngIf="actionButtons">
                <ng-container *ngTemplateOutlet="actionButtons; context: { $implicit: item }">
                </ng-container>
              </ng-container>
              <app-button variant="edit" (onClick)="onEdit.emit(item)">
                Edit
              </app-button>
              <app-button variant="danger" (onClick)="onDelete.emit(item)">
                Delete
              </app-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
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

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: capitalize;
    }

    .status-badge.scheduled {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.in_progress {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.completed {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge.cancelled {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showActions = true;
  
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  @ContentChild('actionButtons') actionButtons?: TemplateRef<any>;
}