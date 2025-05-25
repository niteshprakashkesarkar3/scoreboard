import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();
  private readonly STORAGE_KEY = 'players';

  constructor() {
    this.loadPlayers();
  }

  private loadPlayers(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const players = data ? JSON.parse(data) : [];
      this.playersSubject.next(players);
    } catch (error) {
      console.error('Error loading players:', error);
      this.playersSubject.next([]);
    }
  }

  private savePlayers(players: Player[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(players));
      this.playersSubject.next(players);
    } catch (error) {
      console.error('Error saving players:', error);
    }
  }

  getPlayersByTeam(teamId: string): Player[] {
    return this.playersSubject.value.filter(p => p.teamId === teamId);
  }

  addPlayer(player: Player): void {
    const players = [...this.playersSubject.value, player];
    this.savePlayers(players);
  }

  updatePlayer(player: Player): void {
    const players = this.playersSubject.value.map(p => 
      p.id === player.id ? player : p
    );
    this.savePlayers(players);
  }

  deletePlayer(id: string): void {
    const players = this.playersSubject.value.filter(p => p.id !== id);
    this.savePlayers(players);
  }
}