import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();
  private readonly STORAGE_KEY = 'groups';

  constructor() {
    this.loadGroups();
  }

  private loadGroups(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const groups = data ? JSON.parse(data) : [];
      this.groupsSubject.next(groups);
    } catch (error) {
      console.error('Error loading groups:', error);
      this.groupsSubject.next([]);
    }
  }

  private saveGroups(groups: Group[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
      this.groupsSubject.next(groups);
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  }

  getGroupsByTournament(tournamentId: string): Observable<Group[]> {
    return new Observable(subscriber => {
      this.groups$.subscribe(groups => {
        subscriber.next(groups.filter(g => g.tournamentId === tournamentId));
      });
    });
  }

  addGroup(group: Group): void {
    const groups = [...this.groupsSubject.value, group];
    this.saveGroups(groups);
  }

  updateGroup(group: Group): void {
    const groups = this.groupsSubject.value.map(g => 
      g.id === group.id ? group : g
    );
    this.saveGroups(groups);
  }

  deleteGroup(id: string): void {
    const groups = this.groupsSubject.value.filter(g => g.id !== id);
    this.saveGroups(groups);
  }
}