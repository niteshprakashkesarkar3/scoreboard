import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Innings } from '../models/innings.model';

@Injectable({
  providedIn: 'root'
})
export class InningsService {
  private inningsSubject = new BehaviorSubject<Innings[]>([]);
  public innings$ = this.inningsSubject.asObservable();
  private readonly STORAGE_KEY = 'innings';

  constructor() {
    this.loadInnings();
  }

  private loadInnings(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const innings = data ? JSON.parse(data) : [];
      this.inningsSubject.next(innings);
    } catch (error) {
      console.error('Error loading innings:', error);
      this.inningsSubject.next([]);
    }
  }

  private saveInnings(innings: Innings[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(innings));
      this.inningsSubject.next(innings);
    } catch (error) {
      console.error('Error saving innings:', error);
    }
  }

  getInningsByMatch(matchId: string): Innings[] {
    return this.inningsSubject.value.filter(i => i.match_id === matchId);
  }

  addInnings(innings: Innings): void {
    const allInnings = [...this.inningsSubject.value, innings];
    this.saveInnings(allInnings);
  }

  updateInnings(innings: Innings): void {
    const allInnings = this.inningsSubject.value.map(i => 
      i.id === innings.id ? innings : i
    );
    this.saveInnings(allInnings);
  }
}