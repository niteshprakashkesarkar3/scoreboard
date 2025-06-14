import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Innings } from '../models/innings.model';
import { FallbackDataService } from './fallback-data.service';

@Injectable({
  providedIn: 'root'
})
export class InningsService {
  private inningsSubject = new BehaviorSubject<Innings[]>([]);
  public innings$ = this.inningsSubject.asObservable();
  private readonly STORAGE_KEY = 'innings';

  constructor(private fallbackDataService: FallbackDataService) {
    this.loadInnings();
  }

  private loadInnings(): void {
    try {
      const dummyData = this.fallbackDataService.getDummyInnings();
      const innings = this.fallbackDataService.initializeDataIfEmpty(this.STORAGE_KEY, dummyData);
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
    const data = [...this.inningsSubject.value].filter(i => {
      return i.match_id === matchId
    });
    return data;
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

  deleteInnings(id: string): void {
    const allInnings = this.inningsSubject.value.filter(i => i.id !== id);
    this.saveInnings(allInnings);
  }
}