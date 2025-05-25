import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="app-header">
      <h1>ScoreBoard</h1>
      <nav class="main-navigation">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <div class="dropdown">
          <button class="dropbtn" (click)="toggleManageMenu()">
            Manage
            <span class="arrow" [class.open]="isManageMenuOpen">▼</span>
          </button>
          <div class="dropdown-content" [class.show]="isManageMenuOpen">
            <a routerLink="/tournaments" routerLinkActive="active">Tournaments</a>
            <a routerLink="/groups" routerLinkActive="active">Groups</a>
            <a routerLink="/teams" routerLinkActive="active">Teams</a>
            <a routerLink="/stadiums" routerLinkActive="active">Stadiums</a>
            <a routerLink="/players" routerLinkActive="active">Players</a>
            <a routerLink="/matches" routerLinkActive="active">Matches</a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
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
      align-items: center;
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

    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropbtn {
      background-color: transparent;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 4px;
    }

    .dropbtn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .arrow {
      font-size: 0.8rem;
      transition: transform 0.2s;
    }

    .arrow.open {
      transform: rotate(180deg);
    }

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #fff;
      min-width: 160px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      z-index: 1;
      border-radius: 4px;
      overflow: hidden;
    }

    .dropdown-content.show {
      display: block;
    }

    .dropdown-content a {
      color: #333;
      padding: 0.75rem 1rem;
      text-decoration: none;
      display: block;
      transition: background-color 0.2s;
    }

    .dropdown-content a:hover {
      background-color: #f5f5f5;
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
        flex-direction: column;
        width: 100%;
      }

      .dropdown {
        width: 100%;
      }

      .dropbtn {
        width: 100%;
        justify-content: center;
      }

      .dropdown-content {
        position: static;
        width: 100%;
        box-shadow: none;
        border-radius: 0;
      }
    }
  `]
})
export class HeaderComponent {
  isManageMenuOpen = false;

  toggleManageMenu() {
    this.isManageMenuOpen = !this.isManageMenuOpen;
  }
}