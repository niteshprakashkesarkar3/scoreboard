import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HeaderComponent } from './app/components/header/header.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { TournamentListComponent } from './app/components/tournament-list/tournament-list.component';
import { TournamentFormComponent } from './app/components/tournament-form/tournament-form.component';
import { GroupListComponent } from './app/components/group-list/group-list.component';
import { GroupFormComponent } from './app/components/group-form/group-form.component';
import { TeamListComponent } from './app/components/team-list/team-list.component';
import { TeamFormComponent } from './app/components/team-form/team-form.component';
import { StadiumListComponent } from './app/components/stadium-list/stadium-list.component';
import { StadiumFormComponent } from './app/components/stadium-form/stadium-form.component';
import { PlayerListComponent } from './app/components/player-list/player-list.component';
import { PlayerFormComponent } from './app/components/player-form/player-form.component';
import { MatchListComponent } from './app/components/match-list/match-list.component';
import { MatchFormComponent } from './app/components/match-form/match-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tournaments', component: TournamentListComponent },
  { path: 'tournaments/add', component: TournamentFormComponent },
  { path: 'tournaments/edit/:id', component: TournamentFormComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'groups/add', component: GroupFormComponent },
  { path: 'groups/edit/:id', component: GroupFormComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/add', component: TeamFormComponent },
  { path: 'teams/edit/:id', component: TeamFormComponent },
  { path: 'stadiums', component: StadiumListComponent },
  { path: 'stadiums/add', component: StadiumFormComponent },
  { path: 'stadiums/edit/:id', component: StadiumFormComponent },
  { path: 'players', component: PlayerListComponent },
  { path: 'players/add', component: PlayerFormComponent },
  { path: 'players/edit/:id', component: PlayerFormComponent },
  { path: 'matches', component: MatchListComponent },
  { path: 'matches/add', component: MatchFormComponent },
  { path: 'matches/edit/:id', component: MatchFormComponent }
];

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