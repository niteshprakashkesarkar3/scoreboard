import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TournamentService } from './tournament.service';
import { MatchService } from './match.service';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private tournamentService: TournamentService,
    private matchService: MatchService,
    private teamService: TeamService
  ) {}

  getDashboardData() {
    return combineLatest([
      this.tournamentService.tournaments$,
      this.matchService.matches$,
      this.teamService.teams$
    ]).pipe(
      map(([tournaments, matches, teams]) => ({
        tournaments,
        matches,
        teams
      }))
    );
  }
}