export interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  tournament_id: string;
  stadium_id: string;
  scheduled_at: string | Date;
  total_overs?: number;
  toss_winner_id?: string;
  toss_decision?: 'bat' | 'bowl';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}