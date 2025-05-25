export interface Extras {
  wides: number;
  no_balls: number;
  byes: number;
  leg_byes: number;
}

export interface Innings {
  id: string;
  match_id: string;
  batting_team_id: string;
  bowling_team_id: string;
  total_runs: number;
  wickets: number;
  overs: number;
  extras: Extras;
  status: 'not_started' | 'in_progress' | 'completed';
}