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