import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { TournamentComponent } from './app/components/tournament/tournament.component';
import { MatchComponent } from './app/components/match/match.component';
import { PlayerStatsComponent } from './app/components/player-stats/player-stats.component';
import { TournamentListComponent } from './app/components/tournament-list/tournament-list.component';
import { TournamentFormComponent } from './app/components/tournament-form/tournament-form.component';
import { GroupListComponent } from './app/components/group-list/group-list.component';
import { GroupFormComponent } from './app/components/group-form/group-form.component';
import { TeamListComponent } from './app/components/team-list/team-list.component';
import { TeamFormComponent } from './app/components/team-form/team-form.component';

const routes: Routes = [
  { path: '', component: TournamentComponent },
  { path: 'match/:id', component: MatchComponent },
  { path: 'stats', component: PlayerStatsComponent },
  { path: 'tournaments', component: TournamentListComponent },
  { path: 'tournaments/add', component: TournamentFormComponent },
  { path: 'tournaments/edit/:id', component: TournamentFormComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'groups/add', component: GroupFormComponent },
  { path: 'groups/edit/:id', component: GroupFormComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/add', component: TeamFormComponent },
  { path: 'teams/edit/:id', component: TeamFormComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>ScoreBoard</h1>
        <nav class="main-navigation">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Tournament</a>
          <a routerLink="/tournaments" routerLinkActive="active">Tournaments</a>
          <a routerLink="/groups" routerLinkActive="active">Groups</a>
          <a routerLink="/teams" routerLinkActive="active">Teams</a>
          <a routerLink="/stats" routerLinkActive="active">Player Stats</a>
        </nav>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>ScoreBoard - Copyright ScoreBoard &copy; 2025</p>
      </footer>
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
    
    .app-header {
      background-color: #1B5E20;
      color: white;
      padding: 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
      color: white;
    }
    
    .main-navigation {
      display: flex;
      gap: 1rem;
    }
    
    .main-navigation a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .main-navigation a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .main-navigation a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: bold;
    }
    
    main {
      flex: 1;
      padding: 1.5rem;
      background-color: #f5f5f5;
    }
    
    .app-footer {
      background-color: #1B5E20;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }
    
    @media (max-width: 768px) {
      .app-header {
        padding: 0.75rem;
        flex-direction: column;
        text-align: center;
      }
      
      .app-header h1 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }
      
      .main-navigation {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      main {
        padding: 1rem;
      }
    }
  `]
})
export class App {
  constructor() {}
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
});