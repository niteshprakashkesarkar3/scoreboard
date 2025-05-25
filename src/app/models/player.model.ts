export interface Player {
  id: string;
  name: string;
  roles: ('All Rounder' | 'Batsman' | 'Bowler' | 'Wicket Keeper')[];
  status: 'playing' | 'injured' | 'not playing';
  teamId: string;
}