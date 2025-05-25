export interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  tournament_id: string;
  stadium_id: string;
  scheduled_at: Date; 
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  winner_id?: string;
  result?: string;
}

export interface Innings {
  battingTeam: string;
  bowlingTeam: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
    total: number;
  };
  overHistory: Over[];
}

export interface Over {
  number: number;
  bowler: string;
  runs: number;
  deliveries: Delivery[];
}

export interface Delivery {
  ball: number;
  batsman: string;
  bowler: string;
  runs: number;
  totalRuns: number;
  isExtra: boolean;
  extraType?: 'wide' | 'no ball' | 'bye' | 'leg bye' | 'penalty';
  extraRuns?: number;
  isBoundary: boolean;
  isSix: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped' | 'hit wicket' | 'other';
  fielder?: string;
}