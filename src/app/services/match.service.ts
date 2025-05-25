import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  public matches$ = this.matchesSubject.asObservable();
  private readonly STORAGE_KEY = 'matches';

  constructor() {
    this.loadMatches();
  }

  private loadMatches(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const matches = data ? JSON.parse(data) : [];
      
      // Convert string dates back to Date objects
      matches.forEach((m: Match) => {
        m.scheduled_at = new Date(m.scheduled_at);
      });
      
      this.matchesSubject.next(matches);
    } catch (error) {
      console.error('Error loading matches:', error);
      this.matchesSubject.next([]);
    }
  }

  private saveMatches(matches: Match[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matches));
      this.matchesSubject.next(matches);
    } catch (error) {
      console.error('Error saving matches:', error);
    }
  }

  addMatch(match: Match): void {
    const matches = [...this.matchesSubject.value, match];
    this.saveMatches(matches);
  }

  updateMatch(match: Match): void {
    const matches = this.matchesSubject.value.map(m => 
      m.id === match.id ? match : m
    );
    this.saveMatches(matches);
  }

  deleteMatch(id: string): void {
    const matches = this.matchesSubject.value.filter(m => m.id !== id);
    this.saveMatches(matches);
  }
}