import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, Innings, Delivery } from '../../models/match.model';
import { Player } from '../../models/team.model';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-ball-by-ball',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ball-by-ball-container">
      <div class="current-status">
        <div class="innings-info">
          <h3>{{ getTeamName(innings.battingTeam) }} Inning</h3>
          <div class="score-display">
            <span class="runs">{{ innings.totalRuns }}</span>
            <span class="wickets">/{{ innings.wickets }}</span>
            <span class="overs">({{ formatOvers(innings.overs) }})</span>
          </div>
        </div>
        
        <div class="batsmen-info">
          <div *ngFor="let batsman of currentBatsmen" class="batsman">
            <span class="player-name">
              {{ getPlayerName(batsman.id) }}
              <span *ngIf="batsman.isOnStrike" class="on-strike">*</span>
            </span>
            <span class="batsman-score">
              {{ batsman.runs }}({{ batsman.balls }})
            </span>
            <div class="batsman-stats">
              <span class="boundary">4s: {{ batsman.fours }}</span>
              <span class="boundary">6s: {{ batsman.sixes }}</span>
              <span class="strike-rate">SR: {{ (batsman.runs / batsman.balls * 100) | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
        
        <div class="bowler-info">
          <h4>Bowler: {{ getPlayerName(currentBowler.id) }}</h4>
          <div class="bowler-stats">
            <span>{{ currentBowler.overs }} overs</span>
            <span>{{ currentBowler.maidens }} maidens</span>
            <span>{{ currentBowler.runs }} runs</span>
            <span>{{ currentBowler.wickets }} wickets</span>
            <span>Econ: {{ (currentBowler.runs / currentBowler.overs) | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>
      
      <div class="delivery-input-panel">
        <h3>Add Delivery</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Batsman</label>
            <select [(ngModel)]="newDelivery.batsman">
              <option *ngFor="let batsman of availableBatsmen" [value]="batsman.id">
                {{ getPlayerName(batsman.id) }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Bowler</label>
            <select [(ngModel)]="newDelivery.bowler">
              <option *ngFor="let bowler of availableBowlers" [value]="bowler.id">
                {{ getPlayerName(bowler.id) }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Runs</label>
            <select [(ngModel)]="newDelivery.runs">
              <option [value]="0">0</option>
              <option [value]="1">1</option>
              <option [value]="2">2</option>
              <option [value]="3">3</option>
              <option [value]="4">4</option>
              <option [value]="5">5</option>
              <option [value]="6">6</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Extra</label>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="newDelivery.isExtra">
                Extra
              </label>
            </div>
          </div>
        </div>
        
        <div class="form-row" *ngIf="newDelivery.isExtra">
          <div class="form-group">
            <label>Extra Type</label>
            <select [(ngModel)]="newDelivery.extraType">
              <option value="wide">Wide</option>
              <option value="no ball">No Ball</option>
              <option value="bye">Bye</option>
              <option value="leg bye">Leg Bye</option>
              <option value="penalty">Penalty</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Extra Runs</label>
            <select [(ngModel)]="newDelivery.extraRuns">
              <option [value]="1">1</option>
              <option [value]="2">2</option>
              <option [value]="3">3</option>
              <option [value]="4">4</option>
              <option [value]="5">5</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Wicket</label>
            <div class="checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="newDelivery.isWicket">
                Wicket
              </label>
            </div>
          </div>
          
          <div class="form-group" *ngIf="newDelivery.isWicket">
            <label>Wicket Type</label>
            <select [(ngModel)]="newDelivery.wicketType">
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="run out">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hit wicket">Hit Wicket</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div class="form-row" *ngIf="newDelivery.isWicket && 
            (newDelivery.wicketType === 'caught' || 
             newDelivery.wicketType === 'run out' || 
             newDelivery.wicketType === 'stumped')">
          <div class="form-group">
            <label>Fielder</label>
            <select [(ngModel)]="newDelivery.fielder">
              <option *ngFor="let player of getFieldingTeamPlayers()" [value]="player.id">
                {{ getPlayerName(player.id) }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group full-width">
            <label>Commentary</label>
            <textarea [(ngModel)]="newDelivery.commentary" rows="2"></textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn-add-delivery" (click)="addDelivery()">Add Delivery</button>
        </div>
      </div>
      
      <div class="over-history">
        <h3>Over History</h3>
        
        <div class="over-list">
          <div *ngFor="let over of innings.overHistory" class="over-card">
            <div class="over-header">
              <span class="over-number">Over {{ over.number }}</span>
              <span class="over-summary">{{ over.runs }} runs, {{ over.wickets }} wickets</span>
              <span class="over-bowler">Bowler: {{ getPlayerName(over.bowler) }}</span>
            </div>
            
            <div class="delivery-list">
              <div *ngFor="let delivery of over.deliveries" class="delivery"
                   [ngClass]="{
                     'boundary': delivery.isBoundary,
                     'six': delivery.isSix,
                     'wicket': delivery.isWicket,
                     'extra': delivery.isExtra
                   }">
                <span class="ball-number">{{ delivery.ball }}</span>
                <span class="delivery-info">
                  <span class="delivery-runs" *ngIf="!delivery.isWicket">{{ delivery.runs }}</span>
                  <span class="delivery-wicket" *ngIf="delivery.isWicket">W</span>
                  <span class="delivery-extra" *ngIf="delivery.isExtra">[{{ delivery.extraType }}]</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ball-by-ball-container {
      margin-top: 1rem;
    }
    
    .current-status {
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }
    
    .innings-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .innings-info h3 {
      margin: 0;
      color: #1B5E20;
    }
    
    .score-display {
      display: flex;
      align-items: baseline;
    }
    
    .runs {
      font-size: 1.5rem;
      font-weight: bold;
      font-family: 'Courier New', monospace;
    }
    
    .wickets, .overs {
      font-family: 'Courier New', monospace;
      margin-left: 2px;
    }
    
    .batsmen-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    
    .batsman {
      flex: 1;
      padding: 0.5rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
    
    .batsman:last-child {
      margin-right: 0;
    }
    
    .player-name {
      font-weight: bold;
      display: block;
      margin-bottom: 0.25rem;
    }
    
    .on-strike {
      color: #ff9800;
    }
    
    .batsman-score {
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
    }
    
    .batsman-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.25rem;
    }
    
    .boundary {
      margin-right: 0.5rem;
    }
    
    .bowler-info {
      background-color: #f5f5f5;
      padding: 0.5rem;
      border-radius: 4px;
    }
    
    .bowler-info h4 {
      margin: 0 0 0.5rem;
      color: #333;
    }
    
    .bowler-stats {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    
    .bowler-stats span {
      margin-right: 1rem;
    }
    
    .delivery-input-panel {
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: flex;
      margin-bottom: 1rem;
    }
    
    .form-group {
      flex: 1;
      margin-right: 1rem;
    }
    
    .form-group:last-child {
      margin-right: 0;
    }
    
    .form-group.full-width {
      width: 100%;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      font-size: 0.9rem;
      color: #333;
    }
    
    select, input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #fff;
    }
    
    textarea {
      resize: vertical;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
    }
    
    .checkbox-group label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
    }
    
    .checkbox-group input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
    
    .btn-add-delivery {
      padding: 0.5rem 1.5rem;
      background-color: #1B5E20;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-add-delivery:hover {
      background-color: #2E7D32;
    }
    
    .over-history {
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .over-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .over-card {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .over-header {
      padding: 0.5rem;
      background-color: #f5f5f5;
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    
    .delivery-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0.5rem;
    }
    
    .delivery {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #f5f5f5;
      margin: 0.25rem;
      padding: 0.25rem;
      font-size: 0.8rem;
      box-sizing: border-box;
    }
    
    .delivery.boundary {
      background-color: #bbdefb;
    }
    
    .delivery.six {
      background-color: #c8e6c9;
    }
    
    .delivery.wicket {
      background-color: #ffccbc;
    }
    
    .delivery.extra {
      background-color: #fff9c4;
    }
    
    .ball-number {
      font-size: 0.7rem;
      color: #666;
    }
    
    .delivery-info {
      font-weight: bold;
    }
    
    .delivery-wicket {
      color: #d32f2f;
    }
    
    .delivery-extra {
      font-size: 0.6rem;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
      
      .form-group {
        margin-right: 0;
        margin-bottom: 1rem;
      }
      
      .batsmen-info {
        flex-direction: column;
      }
      
      .batsman {
        margin-right: 0;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class BallByBallComponent implements OnInit {
  @Input() match!: Match;
  @Input() innings!: Innings;
  
  currentBatsmen: any[] = [
    { id: '', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: true },
    { id: '', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: false }
  ];
  
  currentBowler: any = {
    id: '',
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0
  };
  
  availableBatsmen: Player[] = [];
  availableBowlers: Player[] = [];
  
  newDelivery: any = this.initializeNewDelivery();
  
  constructor(private teamService: TeamService) {}
  
  ngOnInit(): void {
    this.initializePlayerLists();
    this.setInitialPlayers();
  }
  
  private initializeNewDelivery() {
    return {
      ball: 1,
      batsman: '',
      bowler: '',
      runs: 0,
      isBoundary: false,
      isSix: false,
      isWicket: false,
      wicketType: 'bowled',
      fielder: '',
      isExtra: false,
      extraType: 'wide',
      extraRuns: 1,
      totalRuns: 0,
      commentary: ''
    };
  }
  
  private initializePlayerLists(): void {
    this.teamService.teams$.subscribe(teams => {
      const battingTeam = teams.find(t => t.id === this.innings.battingTeam);
      const bowlingTeam = teams.find(t => t.id === this.innings.bowlingTeam);
      
      if (battingTeam) {
        this.availableBatsmen = [...battingTeam.players];
      }
      
      if (bowlingTeam) {
        this.availableBowlers = [...bowlingTeam.players].filter(
          p => p.role === 'Bowler' || p.role === 'All-rounder'
        );
      }
      
      if (this.availableBatsmen.length >= 2) {
        this.currentBatsmen[0].id = this.availableBatsmen[0].id;
        this.currentBatsmen[1].id = this.availableBatsmen[1].id;
        this.newDelivery.batsman = this.currentBatsmen[0].id;
      }
      
      if (this.availableBowlers.length > 0) {
        this.currentBowler.id = this.availableBowlers[0].id;
        this.newDelivery.bowler = this.currentBowler.id;
      }
    });
  }
  
  private setInitialPlayers(): void {
    // This would typically be calculated based on the match data
  }
  
  formatOvers(overs: number): string {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  }
  
  getTeamName(teamId: string): string {
    let name = 'Unknown Team';
    this.teamService.teams$.subscribe(teams => {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        name = team.name;
      }
    });
    return name;
  }
  
  getPlayerName(playerId: string): string {
    let name = 'Unknown Player';
    this.teamService.teams$.subscribe(teams => {
      for (const team of teams) {
        const player = team.players.find(p => p.id === playerId);
        if (player) {
          name = player.name;
          break;
        }
      }
    });
    return name;
  }
  
  getFieldingTeamPlayers(): Player[] {
    let players: Player[] = [];
    this.teamService.teams$.subscribe(teams => {
      const bowlingTeam = teams.find(t => t.id === this.innings.bowlingTeam);
      if (bowlingTeam) {
        players = bowlingTeam.players;
      }
    });
    return players;
  }
  
  addDelivery(): void {
    const currentOverNumber = Math.floor(this.innings.overs) + 1;
    
    const delivery: Delivery = {
      ball: this.calculateBallNumber(),
      batsman: this.newDelivery.batsman,
      bowler: this.newDelivery.bowler,
      runs: Number(this.newDelivery.runs),
      isBoundary: Number(this.newDelivery.runs) === 4,
      isSix: Number(this.newDelivery.runs) === 6,
      isWicket: this.newDelivery.isWicket,
      isExtra: this.newDelivery.isExtra,
      totalRuns: this.calculateTotalRuns(),
      commentary: this.newDelivery.commentary || ''
    };
    
    if (delivery.isWicket) {
      delivery.wicketType = this.newDelivery.wicketType;
      if (['caught', 'run out', 'stumped'].includes(this.newDelivery.wicketType)) {
        delivery.fielder = this.newDelivery.fielder;
      }
    }
    
    if (delivery.isExtra) {
      delivery.extraType = this.newDelivery.extraType;
      delivery.extraRuns = Number(this.newDelivery.extraRuns);
    }
    
    this.updateStats(delivery);
    
    this.newDelivery = this.initializeNewDelivery();
    this.newDelivery.batsman = this.currentBatsmen.find(b => b.isOnStrike)?.id || '';
    this.newDelivery.bowler = this.currentBowler.id;
  }
  
  private calculateBallNumber(): number {
    const currentOverNumber = Math.floor(this.innings.overs) + 1;
    const currentOver = this.innings.overHistory.find(o => o.number === currentOverNumber);
    
    if (!currentOver) return 1;
    
    const legalDeliveries = currentOver.deliveries.filter(
      d => !d.isExtra || (d.extraType !== 'wide' && d.extraType !== 'no ball')
    ).length;
    
    if (legalDeliveries >= 6) {
      return 1;
    }
    
    return legalDeliveries + 1;
  }
  
  private calculateTotalRuns(): number {
    let totalRuns = Number(this.newDelivery.runs);
    
    if (this.newDelivery.isExtra) {
      totalRuns += Number(this.newDelivery.extraRuns);
    }
    
    return totalRuns;
  }
  
  private updateStats(delivery: Delivery): void {
    const onStrikeBatsman = this.currentBatsmen.find(b => b.isOnStrike);
    
    if (onStrikeBatsman && onStrikeBatsman.id === delivery.batsman) {
      onStrikeBatsman.runs += delivery.runs;
      onStrikeBatsman.balls += 1;
      
      if (delivery.isBoundary) onStrikeBatsman.fours += 1;
      if (delivery.isSix) onStrikeBatsman.sixes += 1;
      
      if (delivery.runs % 2 === 1) {
        this.toggleStrike();
      }
    }
    
    if (delivery.bowler === this.currentBowler.id) {
      this.currentBowler.runs += delivery.totalRuns;
      
      if (!delivery.isExtra || (delivery.extraType !== 'wide' && delivery.extraType !== 'no ball')) {
        const balls = (this.currentBowler.balls || 0) + 1;
        this.currentBowler.balls = balls;
        this.currentBowler.overs = Math.floor(balls / 6) + (balls % 6) / 10;
      }
      
      if (delivery.isWicket && 
          delivery.wicketType !== 'run out' && 
          delivery.wicketType !== 'other') {
        this.currentBowler.wickets += 1;
      }
    }
    
    const currentOverNumber = Math.floor(this.innings.overs) + 1;
    const currentOver = this.innings.overHistory.find(o => o.number === currentOverNumber);
    
    if (currentOver) {
      const legalDeliveries = currentOver.deliveries.filter(
        d => !d.isExtra || (d.extraType !== 'wide' && d.extraType !== 'no ball')
      ).length;
      
      if (legalDeliveries >= 6) {
        this.toggleStrike();
        
        if (currentOver.runs === 0) {
          this.currentBowler.maidens += 1;
        }
      }
    }
    
    if (delivery.isWicket) {
      const nextBatsmanIndex = this.availableBatsmen.findIndex(
        p => !this.currentBatsmen.some(b => b.id === p.id)
      );
      
      if (nextBatsmanIndex !== -1 && this.innings.wickets < 10) {
        const outBatsmanIndex = this.currentBatsmen.findIndex(b => b.id === delivery.batsman);
        
        if (outBatsmanIndex !== -1) {
          this.currentBatsmen[outBatsmanIndex] = {
            id: this.availableBatsmen[nextBatsmanIndex].id,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isOnStrike: true
          };
          
          this.currentBatsmen[1 - outBatsmanIndex].isOnStrike = false;
        }
      }
    }
  }
  
  private toggleStrike(): void {
    this.currentBatsmen.forEach(batsman => {
      batsman.isOnStrike = !batsman.isOnStrike;
    });
    
    const onStrikeBatsman = this.currentBatsmen.find(b => b.isOnStrike);
    if (onStrikeBatsman) {
      this.newDelivery.batsman = onStrikeBatsman.id;
    }
  }
}