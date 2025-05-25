import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <p>ScoreBoard - Copyright &copy; 2025</p>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #1B5E20;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }
  `]
})
export class FooterComponent {}