import { Injectable } from '@angular/core';
import { Tournament } from '../models/tournament.model';
import { Group } from '../models/group.model';
import { Team } from '../models/team.model';
import { Stadium } from '../models/stadium.model';
import { Player } from '../models/player.model';
import { Match } from '../models/match.model';
import { Innings } from '../models/innings.model';
import { Ball } from '../models/ball.model';

@Injectable({
  providedIn: 'root'
})
export class FallbackDataService {
  
  getDummyTournaments(): Tournament[] {
    return [
      {
        id: '1700000000000',
        name: 'Cricket World Cup 2024',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-15'),
        status: 'ongoing'
      },
      {
        id: '1700000001000',
        name: 'T20 Championship',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-20'),
        status: 'scheduled'
      }
    ];
  }

  getDummyGroups(): Group[] {
    return [
      {
        id: '1700000010000',
        name: 'Group A',
        tournamentId: '1700000000000'
      },
      {
        id: '1700000011000',
        name: 'Group B',
        tournamentId: '1700000000000'
      },
      {
        id: '1700000012000',
        name: 'Group A',
        tournamentId: '1700000001000'
      },
      {
        id: '1700000013000',
        name: 'Group B',
        tournamentId: '1700000001000'
      }
    ];
  }

  getDummyStadiums(): Stadium[] {
    return [
      {
        id: '1700000020000',
        name: 'Wankhede Stadium',
        address: 'D Road, Churchgate',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        latitude: 18.9388,
        longitude: 72.8258
      },
      {
        id: '1700000021000',
        name: 'Eden Gardens',
        address: 'BBD Bagh',
        city: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        latitude: 22.5645,
        longitude: 88.3433
      },
      {
        id: '1700000022000',
        name: 'M. Chinnaswamy Stadium',
        address: 'Cubbon Park',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        latitude: 12.9791,
        longitude: 77.5999
      }
    ];
  }

  getDummyTeams(): Team[] {
    return [
      {
        id: '1700000030000',
        name: 'Mumbai Indians',
        tournamentId: '1700000000000',
        groupId: '1700000010000'
      },
      {
        id: '1700000031000',
        name: 'Chennai Super Kings',
        tournamentId: '1700000000000',
        groupId: '1700000010000'
      },
      {
        id: '1700000032000',
        name: 'Royal Challengers Bangalore',
        tournamentId: '1700000000000',
        groupId: '1700000011000'
      },
      {
        id: '1700000033000',
        name: 'Kolkata Knight Riders',
        tournamentId: '1700000000000',
        groupId: '1700000011000'
      },
      {
        id: '1700000034000',
        name: 'Delhi Capitals',
        tournamentId: '1700000001000',
        groupId: '1700000012000'
      },
      {
        id: '1700000035000',
        name: 'Punjab Kings',
        tournamentId: '1700000001000',
        groupId: '1700000012000'
      }
    ];
  }

  getDummyPlayers(): Player[] {
    return [
      // Mumbai Indians players
      {
        id: '1700000040000',
        name: 'Rohit Sharma',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040001',
        name: 'Jasprit Bumrah',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040002',
        name: 'Hardik Pandya',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040003',
        name: 'Ishan Kishan',
        roles: ['Wicket Keeper', 'Batsman'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040004',
        name: 'Suryakumar Yadav',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040005',
        name: 'Kieron Pollard',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040006',
        name: 'Trent Boult',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040007',
        name: 'Krunal Pandya',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040008',
        name: 'Quinton de Kock',
        roles: ['Wicket Keeper', 'Batsman'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040009',
        name: 'Rahul Chahar',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000030000'
      },
      {
        id: '1700000040010',
        name: 'Nathan Coulter-Nile',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000030000'
      },

      // Chennai Super Kings players
      {
        id: '1700000041000',
        name: 'MS Dhoni',
        roles: ['Wicket Keeper', 'Batsman'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041001',
        name: 'Ravindra Jadeja',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041002',
        name: 'Faf du Plessis',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041003',
        name: 'Ruturaj Gaikwad',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041004',
        name: 'Deepak Chahar',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041005',
        name: 'Moeen Ali',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041006',
        name: 'Dwayne Bravo',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041007',
        name: 'Ambati Rayudu',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041008',
        name: 'Shardul Thakur',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041009',
        name: 'Josh Hazlewood',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000031000'
      },
      {
        id: '1700000041010',
        name: 'Robin Uthappa',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000031000'
      },

      // Royal Challengers Bangalore players
      {
        id: '1700000042000',
        name: 'Virat Kohli',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042001',
        name: 'AB de Villiers',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042002',
        name: 'Glenn Maxwell',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042003',
        name: 'Yuzvendra Chahal',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042004',
        name: 'Mohammed Siraj',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042005',
        name: 'KS Bharat',
        roles: ['Wicket Keeper', 'Batsman'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042006',
        name: 'Devdutt Padikkal',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042007',
        name: 'Washington Sundar',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042008',
        name: 'Harshal Patel',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042009',
        name: 'Kyle Jamieson',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000032000'
      },
      {
        id: '1700000042010',
        name: 'Dan Christian',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000032000'
      },

      // Kolkata Knight Riders players
      {
        id: '1700000043000',
        name: 'Eoin Morgan',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043001',
        name: 'Andre Russell',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043002',
        name: 'Sunil Narine',
        roles: ['All Rounder'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043003',
        name: 'Dinesh Karthik',
        roles: ['Wicket Keeper', 'Batsman'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043004',
        name: 'Shubman Gill',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043005',
        name: 'Nitish Rana',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043006',
        name: 'Pat Cummins',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043007',
        name: 'Varun Chakravarthy',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043008',
        name: 'Prasidh Krishna',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043009',
        name: 'Rahul Tripathi',
        roles: ['Batsman'],
        status: 'playing',
        teamId: '1700000033000'
      },
      {
        id: '1700000043010',
        name: 'Lockie Ferguson',
        roles: ['Bowler'],
        status: 'playing',
        teamId: '1700000033000'
      }
    ];
  }

  getDummyMatches(): Match[] {
    return [
      {
        id: '1700000050000',
        team1_id: '1700000030000',
        team2_id: '1700000031000',
        tournament_id: '1700000000000',
        stadium_id: '1700000020000',
        scheduled_at: new Date('2024-01-20T14:30:00'),
        total_overs: 20,
        toss_winner_id: '1700000030000',
        toss_decision: 'bat',
        status: 'in_progress'
      },
      {
        id: '1700000050001',
        team1_id: '1700000032000',
        team2_id: '1700000033000',
        tournament_id: '1700000000000',
        stadium_id: '1700000021000',
        scheduled_at: new Date('2024-01-22T19:30:00'),
        total_overs: 20,
        status: 'scheduled'
      },
      {
        id: '1700000050002',
        team1_id: '1700000034000',
        team2_id: '1700000035000',
        tournament_id: '1700000001000',
        stadium_id: '1700000022000',
        scheduled_at: new Date('2024-03-05T15:00:00'),
        total_overs: 20,
        status: 'scheduled'
      }
    ];
  }

  getDummyInnings(): Innings[] {
    return [
      {
        id: '1700000050000_1st',
        match_id: '1700000050000',
        batting_team_id: '1700000030000',
        bowling_team_id: '1700000031000',
        total_runs: 85,
        wickets: 3,
        overs: 12.4,
        extras: {
          wides: 4,
          no_balls: 2,
          byes: 1,
          leg_byes: 3
        },
        status: 'in_progress'
      }
    ];
  }

  getDummyBalls(): Ball[] {
    return [
      {
        id: '1700000050000_1st_0_1',
        innings_id: '1700000050000_1st',
        over_number: 0,
        ball_number: 1,
        batsman_id: '1700000040000',
        bowler_id: '1700000041004',
        runs: 1,
        extras: 0,
        outcome: 'regular',
        timestamp: new Date('2024-01-20T14:35:00')
      },
      {
        id: '1700000050000_1st_0_2',
        innings_id: '1700000050000_1st',
        over_number: 0,
        ball_number: 2,
        batsman_id: '1700000040003',
        bowler_id: '1700000041004',
        runs: 4,
        extras: 0,
        outcome: 'regular',
        timestamp: new Date('2024-01-20T14:36:00')
      },
      {
        id: '1700000050000_1st_0_3',
        innings_id: '1700000050000_1st',
        over_number: 0,
        ball_number: 3,
        batsman_id: '1700000040003',
        bowler_id: '1700000041004',
        runs: 0,
        extras: 0,
        outcome: 'regular',
        timestamp: new Date('2024-01-20T14:37:00')
      }
    ];
  }

  initializeDataIfEmpty(storageKey: string, dummyData: any[]): any[] {
    try {
      const existingData = localStorage.getItem(storageKey);
      if (!existingData || JSON.parse(existingData).length === 0) {
        localStorage.setItem(storageKey, JSON.stringify(dummyData));
        return dummyData;
      }
      return JSON.parse(existingData);
    } catch (error) {
      console.error(`Error initializing data for ${storageKey}:`, error);
      localStorage.setItem(storageKey, JSON.stringify(dummyData));
      return dummyData;
    }
  }
}