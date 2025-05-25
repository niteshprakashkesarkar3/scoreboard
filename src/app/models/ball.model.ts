export type BallOutcome = 
  | 'regular' 
  | 'wide'
  | 'no_ball'
  | 'bye'
  | 'leg_bye'
  | 'wicket';

export interface Ball {
  id: string;
  innings_id: string;
  over_number: number;
  ball_number: number;
  batsman_id: string;
  bowler_id: string;
  runs: number;
  extras: number;
  outcome: BallOutcome;
  wicket_type?: 'bowled' | 'caught' | 'lbw' | 'run_out' | 'stumped' | 'hit_wicket';
  fielder_id?: string;
  timestamp: Date;
}