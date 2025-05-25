export interface Team {
  id: string;
  name: string;
  shortName: string;
  group: 'G1' | 'G2';
  players: Player[];
  matches: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  netRunRate: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingStats: {
    matches: number;
    innings: number;
    runs: number;
    balls: number;
    highestScore: number;
    average: number;
    strikeRate: number;
    fifties: number;
    hundreds: number;
    fours: number;
    sixes: number;
    notOuts: number;
  };
  bowlingStats: {
    matches: number;
    innings: number;
    overs: number;
    runs: number;
    wickets: number;
    economy: number;
    average: number;
    bestBowling: string;
    balls: number;
  };
}