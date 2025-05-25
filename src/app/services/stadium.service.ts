import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stadium } from '../models/stadium.model';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private stadiumsSubject = new BehaviorSubject<Stadium[]>([]);
  public stadiums$ = this.stadiumsSubject.asObservable();
  private readonly STORAGE_KEY = 'stadiums';

  constructor() {
    this.loadStadiums();
  }

  private loadStadiums(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const stadiums = data ? JSON.parse(data) : [];
      this.stadiumsSubject.next(stadiums);
    } catch (error) {
      console.error('Error loading stadiums:', error);
      this.stadiumsSubject.next([]);
    }
  }

  private saveStadiums(stadiums: Stadium[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stadiums));
      this.stadiumsSubject.next(stadiums);
    } catch (error) {
      console.error('Error saving stadiums:', error);
    }
  }

  addStadium(stadium: Stadium): void {
    const stadiums = [...this.stadiumsSubject.value, stadium];
    this.saveStadiums(stadiums);
  }

  updateStadium(stadium: Stadium): void {
    const stadiums = this.stadiumsSubject.value.map(s => 
      s.id === stadium.id ? stadium : s
    );
    this.saveStadiums(stadiums);
  }

  deleteStadium(id: string): void {
    const stadiums = this.stadiumsSubject.value.filter(s => s.id !== id);
    this.saveStadiums(stadiums);
  }
}