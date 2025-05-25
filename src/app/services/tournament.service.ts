import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentsSubject = new BehaviorSubject<Tournament[]>([]);
  public tournaments$ = this.tournamentsSubject.asObservable();
  private dataFile = 'data/tournaments.json';

  constructor() {
    this.loadTournaments();
  }

  private loadTournaments(): void {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      const tournaments = JSON.parse(data);
      this.tournamentsSubject.next(tournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      this.tournamentsSubject.next([]);
    }
  }

  private saveTournaments(tournaments: Tournament[]): void {
    try {
      if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
      }
      fs.writeFileSync(this.dataFile, JSON.stringify(tournaments, null, 2));
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