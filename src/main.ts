import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    main {
      flex: 1;
      padding: 1.5rem;
      background-color: #f5f5f5;
    }
    
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
});