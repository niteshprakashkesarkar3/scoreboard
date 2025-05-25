export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
}

export interface Team {
  id: string;
  name: string;
  tournamentId: string;
  groupId: string;
}