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
      
      // Convert string dates back to Date objects and ensure status is set
      matches.forEach((m: Match) => {
        m.scheduled_at = new Date(m.scheduled_at);
        m.status = m.status || 'scheduled';
      });
      
      this.matchesSubject.next(matches);
    } catch (error) {
      console.error('Error loading matches:', error);
      this.matchesSubject.next([]);
    }
  }

  private saveMatches(matches: Match[]): void {
    try {
      // Ensure each match has a status before saving
      const matchesWithStatus = matches.map(match => ({
        ...match,
        status: match.status || 'scheduled'
      }));
      console.log('saveMatches', matchesWithStatus)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(matchesWithStatus));
      this.matchesSubject.next(matchesWithStatus);
    } catch (error) {
      console.error('Error saving matches:', error);
    }
  }

  addMatch(match: Match): void {
    const matches = [...this.matchesSubject.value, {
      ...match,
      status: match.status || 'scheduled'
    }];
    this.saveMatches(matches);
  }

  updateMatch(match: Match): void {
    const matches = this.matchesSubject.value.map(m => 
      m.id === match.id ? {
        ...match,
        status: match.status || 'scheduled'
      } : m
    );
      console.log('maches', matchesWithStatus)
    this.saveMatches(matches);
  }

  deleteMatch(id: string): void {
    const matches = this.matchesSubject.value.filter(m => m.id !== id);
    this.saveMatches(matches);
  }
}