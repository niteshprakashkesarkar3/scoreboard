import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ball } from '../models/ball.model';
import { FallbackDataService } from './fallback-data.service';

@Injectable({
  providedIn: 'root'
})
export class BallService {
  private ballsSubject = new BehaviorSubject<Ball[]>([]);
  public balls$ = this.ballsSubject.asObservable();
  private readonly STORAGE_KEY = 'balls';

  constructor(private fallbackDataService: FallbackDataService) {
    this.loadBalls();
  }

  private loadBalls(): void {
    try {
      const dummyData = this.fallbackDataService.getDummyBalls();
      const balls = this.fallbackDataService.initializeDataIfEmpty(this.STORAGE_KEY, dummyData);
      
      // Convert string dates back to Date objects
      balls.forEach((b: Ball) => {
        b.timestamp = new Date(b.timestamp);
      });
      
      this.ballsSubject.next(balls);
    } catch (error) {
      console.error('Error loading balls:', error);
      this.ballsSubject.next([]);
    }
  }

  private saveBalls(balls: Ball[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(balls));
      this.ballsSubject.next(balls);
    } catch (error) {
      console.error('Error saving balls:', error);
    }
  }

  getBallsByInnings(inningsId: string): Ball[] {
    return this.ballsSubject.value
      .filter(b => b.innings_id === inningsId)
      .sort((a, b) => {
        // Sort by over number first
        if (a.over_number !== b.over_number) {
          return a.over_number - b.over_number;
        }
        // Then by ball number
        return a.ball_number - b.ball_number;
      });
  }

  addBall(ball: Ball): void {
    const balls = [...this.ballsSubject.value, ball];
    this.saveBalls(balls);
  }

  updateBall(ball: Ball): void {
    const balls = this.ballsSubject.value.map(b => 
      b.id === ball.id ? ball : b
    );
    this.saveBalls(balls);
  }

  deleteBall(id: string): void {
    const balls = this.ballsSubject.value.filter(b => b.id !== id);
    this.saveBalls(balls);
  }
}