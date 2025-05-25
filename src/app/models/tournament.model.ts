export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'ongoing' | 'cancelled' | 'scheduled' | 'played';
}