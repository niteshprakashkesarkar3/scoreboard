import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team, Player } from '../models/team.model';
import { Match, Innings, Over, Delivery } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class CricketDataService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private currentMatchSubject = new BehaviorSubject<Match | null>(null);

  public teams$: Observable<Team[]> = this.teamsSubject.asObservable();
  public matches$: Observable<Match[]> = this.matchesSubject.asObservable();
  public currentMatch$: Observable<Match | null> = this.currentMatchSubject.asObservable();

  initializeTournament(teams: Team[]): void {
    this.teamsSubject.next(teams);
  }

  getAllTeams(): Team[] {
    return this.teamsSubject.value;
  }

  getTeamsByGroup(group: 'G1' | 'G2'): Team[] {
    return this.teamsSubject.value.filter(team => team.group === group);
  }

  getTeamById(id: string): Team | undefined {
    return this.teamsSubject.value.find(team => team.id === id);
  }

  getPlayerById(id: string): Player | undefined {
    for (const team of this.teamsSubject.value) {
      const player = team.players.find(p => p.id === id);
      if (player) return player;
    }
    return undefined;
  }

  createMatch(match: Match): void {
    const currentMatches = this.matchesSubject.value;
    this.matchesSubject.next([...currentMatches, match]);
  }

  updateMatch(match: Match): void {
    const currentMatches = this.matchesSubject.value;
    const index = currentMatches.findIndex(m => m.id === match.id);
    
    if (index !== -1) {
      currentMatches[index] = match;
      this.matchesSubject.next([...currentMatches]);
      
      if (this.currentMatchSubject.value?.id === match.id) {
        this.currentMatchSubject.next(match);
      }
    }
  }

  setCurrentMatch(matchId: string): void {
    const match = this.matchesSubject.value.find(m => m.id === matchId);
    if (match) {
      this.currentMatchSubject.next(match);
    }
  }

  addDelivery(matchId: string, inningsId: string, overNumber: number, delivery: Delivery): void {
    const currentMatches = this.matchesSubject.value;
    const matchIndex = currentMatches.findIndex(m => m.id === matchId);
    
    if (matchIndex !== -1) {
      const match = { ...currentMatches[matchIndex] };
      const inningsIndex = match.innings.findIndex(inn => inn.id === inningsId);
      
      if (inningsIndex !== -1) {
        const innings = { ...match.innings[inningsIndex] };
        let overIndex = innings.overHistory.findIndex(o => o.number === overNumber);
        
        if (overIndex === -1) {
          innings.overHistory.push({
            number: overNumber,
            bowler: delivery.bowler,
            runs: 0,
            wickets: 0,
            extras: 0,
            deliveries: []
          });
          overIndex = innings.overHistory.length - 1;
        }
        
        const over = { ...innings.overHistory[overIndex] };
        
        over.deliveries.push(delivery);
        over.runs += delivery.totalRuns;
        if (delivery.isWicket) over.wickets += 1;
        if (delivery.isExtra) over.extras += delivery.extraRuns || 0;
        
        innings.overHistory[overIndex] = over;
        
        innings.totalRuns += delivery.totalRuns;
        if (delivery.isWicket) innings.wickets += 1;
        
        const fullOvers = overNumber - 1;
        const balls = over.deliveries.filter(d => !d.extraType || d.extraType !== 'wide' && d.extraType !== 'no ball').length;
        innings.overs = fullOvers + (balls / 6);
        
        if (delivery.isExtra && delivery.extraType) {
          switch (delivery.extraType) {
            case 'wide':
              innings.extras.wides += delivery.extraRuns || 0;
              break;
            case 'no ball':
              innings.extras.noBalls += delivery.extraRuns || 0;
              break;
            case 'bye':
              innings.extras.byes += delivery.extraRuns || 0;
              break;
            case 'leg bye':
              innings.extras.legByes += delivery.extraRuns || 0;
              break;
            case 'penalty':
              innings.extras.penalties += delivery.extraRuns || 0;
              break;
          }
          innings.extras.total += delivery.extraRuns || 0;
        }
        
        match.innings[inningsIndex] = innings;
        currentMatches[matchIndex] = match;
        this.matchesSubject.next([...currentMatches]);
        
        if (this.currentMatchSubject.value?.id === matchId) {
          this.currentMatchSubject.next(match);
        }
        
        this.updatePlayerStats(delivery);
      }
    }
  }

  private updatePlayerStats(delivery: Delivery): void {
    const teams = this.teamsSubject.value;
    let batsmanFound = false;
    let bowlerFound = false;
    
    for (const team of teams) {
      if (!batsmanFound) {
        const batsmanIndex = team.players.findIndex(p => p.id === delivery.batsman);
        if (batsmanIndex !== -1) {
          const batsman = { ...team.players[batsmanIndex] };
          
          batsman.battingStats.balls += 1;
          batsman.battingStats.runs += delivery.runs;
          
          if (delivery.isBoundary) batsman.battingStats.fours += 1;
          if (delivery.isSix) batsman.battingStats.sixes += 1;
          
          batsman.battingStats.strikeRate = (batsman.battingStats.runs / batsman.battingStats.balls) * 100;
          
          team.players[batsmanIndex] = batsman;
          batsmanFound = true;
        }
      }
      
      if (!bowlerFound) {
        const bowlerIndex = team.players.findIndex(p => p.id === delivery.bowler);
        if (bowlerIndex !== -1) {
          const bowler = { ...team.players[bowlerIndex] };
          
          if (!delivery.extraType || (delivery.extraType !== 'wide' && delivery.extraType !== 'no ball')) {
            bowler.bowlingStats.balls = (bowler.bowlingStats.balls || 0) + 1;
            const balls = bowler.bowlingStats.balls;
            const fullOvers = Math.floor(balls / 6);
            const remainingBalls = balls % 6;
            bowler.bowlingStats.overs = fullOvers + (remainingBalls / 10);
          }
          
          bowler.bowlingStats.runs += delivery.totalRuns;
          
          if (delivery.isWicket && 
              delivery.wicketType !== 'run out' && 
              delivery.wicketType !== 'other') {
            bowler.bowlingStats.wickets += 1;
          }
          
          const totalOvers = Math.floor(bowler.bowlingStats.balls / 6) + ((bowler.bowlingStats.balls % 6) / 10);
          bowler.bowlingStats.economy = totalOvers > 0 
            ? bowler.bowlingStats.runs / totalOvers 
            : 0;
          
          team.players[bowlerIndex] = bowler;
          bowlerFound = true;
        }
      }
      
      if (batsmanFound && bowlerFound) break;
    }
    
    this.teamsSubject.next([...teams]);
  }

  calculateStandings(): void {
    const teams = this.teamsSubject.value;
    const matches = this.matchesSubject.value.filter(m => m.status === 'completed');
    
    teams.forEach(team => {
      team.matches = 0;
      team.won = 0;
      team.lost = 0;
      team.tied = 0;
      team.points = 0;
    });
    
    matches.forEach(match => {
      if (match.result) {
        const teamAIndex = teams.findIndex(t => t.id === match.teamA);
        const teamBIndex = teams.findIndex(t => t.id === match.teamB);
        
        if (teamAIndex !== -1 && teamBIndex !== -1) {
          teams[teamAIndex].matches += 1;
          teams[teamBIndex].matches += 1;
          
          if (match.result === 'tie') {
            teams[teamAIndex].tied += 1;
            teams[teamBIndex].tied += 1;
            teams[teamAIndex].points += 1;
            teams[teamBIndex].points += 1;
          } else if (match.result === match.teamA) {
            teams[teamAIndex].won += 1;
            teams[teamBIndex].lost += 1;
            teams[teamAIndex].points += 2;
          } else if (match.result === match.teamB) {
            teams[teamAIndex].lost += 1;
            teams[teamBIndex].won += 1;
            teams[teamBIndex].points += 2;
          }
        }
      }
    });
    
    this.teamsSubject.next([...teams]);
  }
}