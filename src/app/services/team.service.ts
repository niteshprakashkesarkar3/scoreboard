import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { FallbackDataService } from './fallback-data.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public teams$ = this.teamsSubject.asObservable();
  private readonly STORAGE_KEY = 'teams';

  constructor(private fallbackDataService: FallbackDataService) {
    this.loadTeams();
  }

  private loadTeams(): void {
    try {
      const dummyData = this.fallbackDataService.getDummyTeams();
      const teams = this.fallbackDataService.initializeDataIfEmpty(this.STORAGE_KEY, dummyData);
      this.teamsSubject.next(teams);
    } catch (error) {
      console.error('Error loading teams:', error);
      this.teamsSubject.next([]);
    }
  }

  private saveTeams(teams: Team[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams));
      this.teamsSubject.next(teams);
    } catch (error) {
      console.error('Error saving teams:', error);
    }
  }

  getTeamsByTournament(tournamentId: string): Observable<Team[]> {
    return new Observable(subscriber => {
      this.teams$.subscribe(teams => {
        subscriber.next(teams.filter(t => t.tournamentId === tournamentId));
      });
    });
  }

  getTeamsByGroup(groupId: string): Observable<Team[]> {
    return new Observable(subscriber => {
      this.teams$.subscribe(teams => {
        subscriber.next(teams.filter(t => t.groupId === groupId));
      });
    });
  }

  addTeam(team: Team): void {
    const teams = [...this.teamsSubject.value, team];
    this.saveTeams(teams);
  }

  updateTeam(team: Team): void {
    const teams = this.teamsSubject.value.map(t => 
      t.id === team.id ? team : t
    );
    this.saveTeams(teams);
  }

  deleteTeam(id: string): void {
    const teams = this.teamsSubject.value.filter(t => t.id !== id);
    this.saveTeams(teams);
  }
}