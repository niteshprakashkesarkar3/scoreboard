import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { FallbackDataService } from './fallback-data.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentsSubject = new BehaviorSubject<Tournament[]>([]);
  public tournaments$ = this.tournamentsSubject.asObservable();
  private readonly STORAGE_KEY = 'tournaments';

  constructor(private fallbackDataService: FallbackDataService) {
    this.loadTournaments();
  }

  private loadTournaments(): void {
    try {
      const dummyData = this.fallbackDataService.getDummyTournaments();
      const tournaments = this.fallbackDataService.initializeDataIfEmpty(this.STORAGE_KEY, dummyData);
      
      // Convert string dates back to Date objects
      tournaments.forEach((t: Tournament) => {
        t.startDate = new Date(t.startDate);
        t.endDate = new Date(t.endDate);
      });
      
      this.tournamentsSubject.next(tournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      this.tournamentsSubject.next([]);
    }
  }

  private saveTournaments(tournaments: Tournament[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tournaments));
      this.tournamentsSubject.next(tournaments);
    } catch (error) {
      console.error('Error saving tournaments:', error);
    }
  }

  addTournament(tournament: Tournament): void {
    const tournaments = [...this.tournamentsSubject.value, tournament];
    this.saveTournaments(tournaments);
  }

  updateTournament(tournament: Tournament): void {
    const tournaments = this.tournamentsSubject.value.map(t => 
      t.id === tournament.id ? tournament : t
    );
    this.saveTournaments(tournaments);
  }

  deleteTournament(id: string): void {
    const tournaments = this.tournamentsSubject.value.filter(t => t.id !== id);
    this.saveTournaments(tournaments);
  }
}