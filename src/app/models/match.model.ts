export interface Match {
  id: string;
  date: Date;
  venue: string;
  teamA: string; // Team ID
  teamB: string; // Team ID
  tossWinner: string; // Team ID
  tossDecision: 'bat' | 'bowl';
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
  innings: Innings[];
}

export interface Innings {
  id: string;
  matchId: string;
  battingTeam: string; // Team ID
  bowlingTeam: string; // Team ID
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
  completed: boolean;
  overHistory: Over[];
}

export interface Over {
  number: number;
  bowler: string; // Player ID
  runs: number;
  wickets: number;
  extras: number;
  deliveries: Delivery[];
}

export interface Delivery {
  ball: number;
  batsman: string; // Player ID
  bowler: string; // Player ID
  runs: number;
  isBoundary: boolean;
  isSix: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped' | 'hit wicket' | 'other';
  fielder?: string; // Player ID (for caught, run out, stumped)
  isExtra: boolean;
  extraType?: 'wide' | 'no ball' | 'bye' | 'leg bye' | 'penalty';
  extraRuns?: number;
  totalRuns: number; // Batsman runs + extra runs
  commentary?: string;
}