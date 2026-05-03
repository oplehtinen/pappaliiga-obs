// Mock data for different match game states based on FACEIT API structure
import type {
	matchDetails,
	matchStats,
	matchId,
	team,
	player,
	playerId,
	teamId,
	organizerId,
	tournamentId,
	mapStatsForTeams,
	mapData,
	mapStat
} from './dataTypes';

// Mock Match IDs for different states
export const MOCK_MATCH_IDS = {
	SCHEDULED: 'match-scheduled-123' as matchId,
	ONGOING_MAP1: 'match-ongoing-map1-456' as matchId,
	ONGOING_MAP2: 'match-ongoing-map2-789' as matchId,
	FINISHED: 'match-finished-abc' as matchId,
	LIVE_UPDATING: 'match-live-updating-xyz' as matchId,
	ONE_PLAYED_WAITING: 'match-one-played-waiting-555' as matchId,
	NOT_FOUND: 'match-not-found-xyz' as matchId,
	INVALID_DATA: 'match-invalid-data-def' as matchId
} as const;

// Common team data
const mockTeam1: team = {
	faction_id: 'team1-id' as teamId,
	name: 'Team Alpha',
	avatar: 'https://example.com/team1-avatar.jpg',
	roster: [
		{
			player_id: 'player1-id' as playerId,
			nickname: 'Alpha1',
			avatar: 'https://example.com/player1-avatar.jpg'
		},
		{
			player_id: 'player2-id' as playerId,
			nickname: 'Alpha2',
			avatar: 'https://example.com/player2-avatar.jpg'
		},
		{
			player_id: 'player3-id' as playerId,
			nickname: 'Alpha3',
			avatar: 'https://example.com/player3-avatar.jpg'
		},
		{
			player_id: 'player4-id' as playerId,
			nickname: 'Alpha4',
			avatar: 'https://example.com/player4-avatar.jpg'
		},
		{
			player_id: 'player5-id' as playerId,
			nickname: 'Alpha5',
			avatar: 'https://example.com/player5-avatar.jpg'
		}
	],
	score: 0
};

const mockTeam2: team = {
	faction_id: 'team2-id' as teamId,
	name: 'Team Beta',
	avatar: 'https://example.com/team2-avatar.jpg',
	roster: [
		{
			player_id: 'player6-id' as playerId,
			nickname: 'Beta1',
			avatar: 'https://example.com/player6-avatar.jpg'
		},
		{
			player_id: 'player7-id' as playerId,
			nickname: 'Beta2',
			avatar: 'https://example.com/player7-avatar.jpg'
		},
		{
			player_id: 'player8-id' as playerId,
			nickname: 'Beta3',
			avatar: 'https://example.com/player8-avatar.jpg'
		},
		{
			player_id: 'player9-id' as playerId,
			nickname: 'Beta4',
			avatar: 'https://example.com/player9-avatar.jpg'
		},
		{
			player_id: 'player10-id' as playerId,
			nickname: 'Beta5',
			avatar: 'https://example.com/player10-avatar.jpg'
		}
	],
	score: 0
};

// Mock match details for different states
export const MOCK_MATCH_DETAILS: Record<string, matchDetails> = {
	[MOCK_MATCH_IDS.SCHEDULED]: {
		match_id: MOCK_MATCH_IDS.SCHEDULED,
		competition_id: 'tournament-123' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Test Tournament',
		organizer_id: 'organizer-123' as organizerId,
		teams: {
			faction1: { ...mockTeam1 },
			faction2: { ...mockTeam2 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 0,
		scheduled_at: Date.now() + 3600000, // 1 hour from now
		configured_at: Date.now() - 1800000, // 30 minutes ago
		started_at: 0, // Not started yet
		finished_at: 0, // Not finished
		results: {
			winner: '',
			score: {
				faction1: 0,
				faction2: 0
			}
		},
		status: 'READY' // Match is scheduled but not started
	},

	[MOCK_MATCH_IDS.ONGOING_MAP1]: {
		match_id: MOCK_MATCH_IDS.ONGOING_MAP1,
		competition_id: 'tournament-123' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Test Tournament',
		organizer_id: 'organizer-123' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: 8 },
			faction2: { ...mockTeam2, score: 4 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 1,
		scheduled_at: Date.now() - 7200000, // 2 hours ago
		configured_at: Date.now() - 5400000, // 1.5 hours ago
		started_at: Date.now() - 3600000, // 1 hour ago
		finished_at: 0, // Not finished
		results: {
			winner: '',
			score: {
				faction1: 0,
				faction2: 0
			}
		},
		status: 'ONGOING' // Match is currently being played - first map
	},

	[MOCK_MATCH_IDS.ONGOING_MAP2]: {
		match_id: MOCK_MATCH_IDS.ONGOING_MAP2,
		competition_id: 'tournament-123' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Test Tournament',
		organizer_id: 'organizer-123' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: 1 },
			faction2: { ...mockTeam2, score: 1 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 2,
		scheduled_at: Date.now() - 10800000, // 3 hours ago
		configured_at: Date.now() - 9000000, // 2.5 hours ago
		started_at: Date.now() - 7200000, // 2 hours ago
		finished_at: 0, // Not finished
		results: {
			winner: '',
			score: {
				faction1: 1,
				faction2: 1
			}
		},
		status: 'ONGOING' // Match is currently being played - second map, series is 1-1
	},

	[MOCK_MATCH_IDS.FINISHED]: {
		match_id: MOCK_MATCH_IDS.FINISHED,
		competition_id: 'tournament-123' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Test Tournament',
		organizer_id: 'organizer-123' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: 2 },
			faction2: { ...mockTeam2, score: 1 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 3,
		scheduled_at: Date.now() - 14400000, // 4 hours ago
		configured_at: Date.now() - 12600000, // 3.5 hours ago
		started_at: Date.now() - 10800000, // 3 hours ago
		finished_at: Date.now() - 3600000, // 1 hour ago
		results: {
			winner: 'team1-id',
			score: {
				faction1: 2,
				faction2: 1
			}
		},
		status: 'FINISHED' // Match is completed
	},
	[MOCK_MATCH_IDS.LIVE_UPDATING]: {
		match_id: MOCK_MATCH_IDS.LIVE_UPDATING,
		competition_id: 'tournament-live' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Live Demo Tournament',
		organizer_id: 'organizer-live' as organizerId,
		teams: {
			// Treat as ongoing first map with current round score-like numbers
			faction1: { ...mockTeam1, score: 9 },
			faction2: { ...mockTeam2, score: 7 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 1,
		scheduled_at: Date.now() - 3600000, // 1 hour ago
		configured_at: Date.now() - 3000000, // 50 minutes ago
		started_at: Date.now() - 1800000, // 30 minutes ago
		finished_at: 0, // Not finished
		results: {
			winner: '',
			score: {
				faction1: 0,
				faction2: 0
			}
		},
		status: 'ONGOING'
	}
	,
	[MOCK_MATCH_IDS.ONE_PLAYED_WAITING]: {
		match_id: MOCK_MATCH_IDS.ONE_PLAYED_WAITING,
		competition_id: 'tournament-123' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Test Tournament',
		organizer_id: 'organizer-123' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: 1 },
			faction2: { ...mockTeam2, score: 0 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage'] }
		},
		round: 2,
		scheduled_at: Date.now() - 7200000,
		configured_at: Date.now() - 5400000,
		started_at: Date.now() - 3600000,
		finished_at: 0,
		results: {
			winner: '',
			score: {
				faction1: 1,
				faction2: 0
			}
		},
		status: 'READY' // One map done, next not started
	}
};

// Mock match stats (round by round statistics)
export const MOCK_MATCH_STATS: Record<string, matchStats[]> = {
	[MOCK_MATCH_IDS.SCHEDULED]: [], // No stats for scheduled match

	[MOCK_MATCH_IDS.ONGOING_MAP1]: [
		{
			match_round: 1,
			played: true,
			round_stats: {
				Winner: 'team1-id' as teamId,
				Rounds: 30,
				Score: '16-14',
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 3,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.2,
							Kills: 18,
							'Triple Kills': 1,
							'K/R Ratio': 0.6,
							Headshots: 8,
							Deaths: 15,
							'Headshots %': 44,
							Assists: 4
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '14',
						'Team Win': '0'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.9,
							Kills: 14,
							'Triple Kills': 0,
							'K/R Ratio': 0.5,
							Headshots: 6,
							Deaths: 16,
							'Headshots %': 43,
							Assists: 3
						}
					}))
				}
			]
		}
	],

	[MOCK_MATCH_IDS.ONGOING_MAP2]: [
		// First map stats (finished)
		{
			match_round: 1,
			played: true,
			round_stats: {
				Winner: 'team1-id' as teamId,
				Rounds: 30,
				Score: '16-14',
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 3,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.2,
							Kills: 18,
							'Triple Kills': 1,
							'K/R Ratio': 0.6,
							Headshots: 8,
							Deaths: 15,
							'Headshots %': 44,
							Assists: 4
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '14',
						'Team Win': '0'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.9,
							Kills: 14,
							'Triple Kills': 0,
							'K/R Ratio': 0.5,
							Headshots: 6,
							Deaths: 16,
							'Headshots %': 43,
							Assists: 3
						}
					}))
				}
			]
		},
		// Second map stats (finished)
		{
			match_round: 2,
			played: true,
			round_stats: {
				Winner: 'team2-id' as teamId,
				Rounds: 28,
				Score: '13-16',
				Map: 'de_mirage'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '13',
						'Team Win': '0'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.8,
							Kills: 16,
							'Triple Kills': 0,
							'K/R Ratio': 0.57,
							Headshots: 7,
							Deaths: 20,
							'Headshots %': 44,
							Assists: 5
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 1,
							MVPs: 4,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.25,
							Kills: 20,
							'Triple Kills': 1,
							'K/R Ratio': 0.71,
							Headshots: 9,
							Deaths: 16,
							'Headshots %': 45,
							Assists: 3
						}
					}))
				}
			]
		},
		// Third map stats (ongoing)
		{
			match_round: 3,
			played: false, // Currently being played
			round_stats: {
				Winner: '',
				Rounds: 12, // Current round count
				Score: '8-4', // Current score
				Map: 'de_dust2'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '8',
						'Team Win': ''
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 1.5,
							Kills: 12,
							'Triple Kills': 1,
							'K/R Ratio': 1.0,
							Headshots: 5,
							Deaths: 8,
							'Headshots %': 42,
							Assists: 2
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '4',
						'Team Win': ''
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 1,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.67,
							Kills: 8,
							'Triple Kills': 0,
							'K/R Ratio': 0.67,
							Headshots: 3,
							Deaths: 12,
							'Headshots %': 38,
							Assists: 3
						}
					}))
				}
			]
		}
	],

	[MOCK_MATCH_IDS.FINISHED]: [
		// All three maps completed
		{
			match_round: 1,
			played: true,
			round_stats: {
				Winner: 'team1-id' as teamId,
				Rounds: 30,
				Score: '16-14',
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 3,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.2,
							Kills: 18,
							'Triple Kills': 1,
							'K/R Ratio': 0.6,
							Headshots: 8,
							Deaths: 15,
							'Headshots %': 44,
							Assists: 4
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '14',
						'Team Win': '0'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.9,
							Kills: 14,
							'Triple Kills': 0,
							'K/R Ratio': 0.5,
							Headshots: 6,
							Deaths: 16,
							'Headshots %': 43,
							Assists: 3
						}
					}))
				}
			]
		},
		{
			match_round: 2,
			played: true,
			round_stats: {
				Winner: 'team2-id' as teamId,
				Rounds: 28,
				Score: '13-16',
				Map: 'de_mirage'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '13',
						'Team Win': '0'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.8,
							Kills: 16,
							'Triple Kills': 0,
							'K/R Ratio': 0.57,
							Headshots: 7,
							Deaths: 20,
							'Headshots %': 44,
							Assists: 5
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 1,
							MVPs: 4,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.25,
							Kills: 20,
							'Triple Kills': 1,
							'K/R Ratio': 0.71,
							Headshots: 9,
							Deaths: 16,
							'Headshots %': 45,
							Assists: 3
						}
					}))
				}
			]
		},
		{
			match_round: 3,
			played: true,
			round_stats: {
				Winner: 'team1-id' as teamId,
				Rounds: 30,
				Score: '16-14',
				Map: 'de_dust2'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 5,
							Result: 1,
							'Penta Kills': 1,
							'K/D Ratio': 1.4,
							Kills: 21,
							'Triple Kills': 2,
							'K/R Ratio': 0.7,
							Headshots: 9,
							Deaths: 15,
							'Headshots %': 43,
							Assists: 4
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '14',
						'Team Win': '0'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 3,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.85,
							Kills: 17,
							'Triple Kills': 1,
							'K/R Ratio': 0.57,
							Headshots: 7,
							Deaths: 20,
							'Headshots %': 41,
							Assists: 5
						}
					}))
				}
			]
		}
	],
	[MOCK_MATCH_IDS.LIVE_UPDATING]: [
		{
			match_round: 1,
			played: false, // Currently being played
			round_stats: {
				Winner: '',
				Rounds: 16,
				Score: '9-7',
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '9',
						'Team Win': ''
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 1,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 1.1,
							Kills: 12,
							'Triple Kills': 0,
							'K/R Ratio': 0.75,
							Headshots: 5,
							Deaths: 11,
							'Headshots %': 42,
							Assists: 3
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '7',
						'Team Win': ''
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 1,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.9,
							Kills: 10,
							'Triple Kills': 0,
							'K/R Ratio': 0.63,
							Headshots: 4,
							Deaths: 12,
							'Headshots %': 40,
							Assists: 2
						}
					}))
				}
			]
		}
	]
	,
	[MOCK_MATCH_IDS.ONE_PLAYED_WAITING]: [
		{
			match_round: 1,
			played: true,
			round_stats: {
				Winner: 'team1-id' as teamId,
				Rounds: 30,
				Score: '16-14',
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': '16',
						'Team Win': '1'
					},
					players: mockTeam1.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 3,
							Result: 1,
							'Penta Kills': 0,
							'K/D Ratio': 1.2,
							Kills: 18,
							'Triple Kills': 1,
							'K/R Ratio': 0.6,
							Headshots: 8,
							Deaths: 15,
							'Headshots %': 44,
							Assists: 4
						}
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': '14',
						'Team Win': '0'
					},
					players: mockTeam2.roster.map((player) => ({
						player_id: player.player_id,
						nickname: player.nickname,
						avatar: player.avatar,
						player_stats: {
							'Quadro Kills': 0,
							MVPs: 2,
							Result: 0,
							'Penta Kills': 0,
							'K/D Ratio': 0.9,
							Kills: 14,
							'Triple Kills': 0,
							'K/R Ratio': 0.5,
							Headshots: 6,
							Deaths: 16,
							'Headshots %': 43,
							Assists: 3
						}
					}))
				}
			]
		},
		// Second map not started yet: we omit a second entry to reflect no stats yet
	]
};

// Mock organizer data
export const MOCK_ORGANIZER_DATA = {
	organizer_id: 'organizer-123',
	name: 'Test Tournament Organizer',
	avatar: 'https://example.com/organizer-avatar.jpg'
};

// Mock team stats for maps
export const MOCK_TEAM_STATS_FOR_MAPS: mapStatsForTeams = {
	Inferno: {
		label: 'Inferno',
		img_regular: 'https://example.com/inferno.jpg',
		map_stats: [
			{
				Matches: 10,
				Wins: 7,
				'Win Rate %': 70
			},
			{
				Matches: 8,
				Wins: 3,
				'Win Rate %': 37.5
			}
		] as [mapStat, mapStat]
	},
	Mirage: {
		label: 'Mirage',
		img_regular: 'https://example.com/mirage.jpg',
		map_stats: [
			{
				Matches: 12,
				Wins: 6,
				'Win Rate %': 50
			},
			{
				Matches: 15,
				Wins: 9,
				'Win Rate %': 60
			}
		] as [mapStat, mapStat]
	},
	Dust2: {
		label: 'Dust2',
		img_regular: 'https://example.com/dust2.jpg',
		map_stats: [
			{
				Matches: 8,
				Wins: 5,
				'Win Rate %': 62.5
			},
			{
				Matches: 6,
				Wins: 2,
				'Win Rate %': 33.3
			}
		] as [mapStat, mapStat]
	}
};

// Mock player tournament stats
// Helper to generate tournament stats per fetch so values vary between requests
export function generatePlayerTournamentStats() {
	const faction1 = {
		...mockTeam1,
		roster: mockTeam1.roster.map((player) => ({
			...player,
			stats: {
				'K/D Ratio': Number((Math.random() * 0.5 + 0.8).toFixed(2)), // 0.8 - 1.3
				'Avg K/R': Number((Math.random() * 0.3 + 0.5).toFixed(2)), // 0.5 - 0.8
				'Win Rate %': Number((Math.random() * 20 + 60).toFixed(1)), // 60 - 80%
				Matches: Math.floor(Math.random() * 50) + 20, // 20 - 70 matches
				Wins: 0 // Calculated below
			}
		}))
	};

	const faction2 = {
		...mockTeam2,
		roster: mockTeam2.roster.map((player) => ({
			...player,
			stats: {
				'K/D Ratio': Number((Math.random() * 0.5 + 0.8).toFixed(2)),
				'Avg K/R': Number((Math.random() * 0.3 + 0.5).toFixed(2)),
				'Win Rate %': Number((Math.random() * 20 + 60).toFixed(1)),
				Matches: Math.floor(Math.random() * 50) + 20,
				Wins: 0
			}
		}))
	};

	// Calculate wins based on win rate for each faction
	faction1.roster.forEach((player) => {
		player.stats.Wins = Math.floor(player.stats.Matches * (player.stats['Win Rate %'] / 100));
	});
	faction2.roster.forEach((player) => {
		player.stats.Wins = Math.floor(player.stats.Matches * (player.stats['Win Rate %'] / 100));
	});

	return { faction1, faction2 } as const;
}

// Backward-compatible constant; generated at module load once
export const MOCK_PLAYER_STATS = generatePlayerTournamentStats();

// Live updating data generator
export function generateLiveUpdatingData(): { details: matchDetails; stats: matchStats[] } {
	const now = Date.now();
	// Each "round" lasts 30 seconds in real time
	const roundDuration = 30000; // 30 seconds
	const startTime = now - (now % (roundDuration * 30)); // Start from a round number
	const elapsedTime = now - startTime;
	const currentRound = Math.floor(elapsedTime / roundDuration) + 1;

	// Simulate score progression (max 30 rounds for a full match)
	const maxRounds = 30;
	const effectiveRound = Math.min(currentRound, maxRounds);

	// Score progression: starts at 5-3, progresses over time
	const baseScore1 = 5;
	const baseScore2 = 3;
	const additionalRounds = Math.floor(effectiveRound / 2); // Slower progression

	let team1Score = baseScore1 + Math.floor(additionalRounds * 0.6);
	let team2Score = baseScore2 + Math.floor(additionalRounds * 0.4);

	// Ensure realistic CS:GO score progression (first to 16 wins)
	if (team1Score >= 16) {
		team1Score = 16;
		team2Score = Math.min(team2Score, 14);
	}

	const totalRounds = team1Score + team2Score;

	const details: matchDetails = {
		match_id: MOCK_MATCH_IDS.LIVE_UPDATING,
		competition_id: 'tournament-live' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Live Demo Tournament',
		organizer_id: 'organizer-live' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: team1Score >= 16 ? 1 : 0 },
			faction2: { ...mockTeam2, score: team2Score >= 16 ? 1 : 0 }
		},
		voting: {
			map: { pick: ['de_inferno', 'de_mirage', 'de_dust2'] }
		},
		round: 1,
		scheduled_at: startTime - 3600000, // 1 hour before start
		configured_at: startTime - 1800000, // 30 minutes before start
		started_at: startTime,
		finished_at: team1Score >= 16 || team2Score >= 16 ? now : 0,
		results: {
			winner: team1Score >= 16 ? 'team1-id' : team2Score >= 16 ? 'team2-id' : '',
			score: {
				faction1: team1Score >= 16 ? 1 : 0,
				faction2: team2Score >= 16 ? 1 : 0
			}
		},
		status: team1Score >= 16 || team2Score >= 16 ? 'FINISHED' : 'ONGOING'
	};

	// Generate dynamic player stats based on current progress
	const progressRatio = totalRounds / 30; // How far through the match we are

	const stats: matchStats[] = [
		{
			match_round: 1,
			played: team1Score >= 16 || team2Score >= 16,
			round_stats: {
				Winner:
					team1Score >= 16
						? ('team1-id' as teamId)
						: team2Score >= 16
							? ('team2-id' as teamId)
							: '',
				Rounds: totalRounds,
				Score: `${team1Score}-${team2Score}`,
				Map: 'de_inferno'
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': team1Score.toString(),
						'Team Win': team1Score >= 16 ? '1' : ''
					},
					players: mockTeam1.roster.map((player) => {
						// Dynamic stats that increase over time
						const baseKills = 8;
						const baseDeaths = 6;
						const kills = Math.floor(baseKills + progressRatio * 12); // 8-20 kills
						const deaths = Math.floor(baseDeaths + progressRatio * 10); // 6-16 deaths
						const headshots = Math.floor(kills * (0.35 + Math.random() * 0.15)); // 35-50% HS rate
						const mvps = Math.floor(progressRatio * 5); // 0-5 MVPs

						return {
							player_id: player.player_id,
							nickname: player.nickname,
							avatar: player.avatar,
							player_stats: {
								'Quadro Kills': Math.floor(Math.random() * progressRatio * 2), // 0-2
								MVPs: mvps,
								Result: team1Score >= 16 ? 1 : 0,
								'Penta Kills': progressRatio > 0.8 ? Math.floor(Math.random() * 2) : 0,
								'K/D Ratio': Number((kills / Math.max(deaths, 1)).toFixed(2)),
								Kills: kills,
								'Triple Kills': Math.floor(progressRatio * 3), // 0-3
								'K/R Ratio': Number((kills / Math.max(totalRounds, 1)).toFixed(2)),
								Headshots: headshots,
								Deaths: deaths,
								'Headshots %': Math.floor((headshots / Math.max(kills, 1)) * 100),
								Assists: Math.floor(progressRatio * 8) // 0-8 assists
							}
						};
					})
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': team2Score.toString(),
						'Team Win': team2Score >= 16 ? '1' : ''
					},
					players: mockTeam2.roster.map((player) => {
						// Slightly worse stats for team2 (they're losing)
						const baseKills = 6;
						const baseDeaths = 8;
						const kills = Math.floor(baseKills + progressRatio * 10); // 6-16 kills
						const deaths = Math.floor(baseDeaths + progressRatio * 12); // 8-20 deaths
						const headshots = Math.floor(kills * (0.3 + Math.random() * 0.15)); // 30-45% HS rate
						const mvps = Math.floor(progressRatio * 3); // 0-3 MVPs

						return {
							player_id: player.player_id,
							nickname: player.nickname,
							avatar: player.avatar,
							player_stats: {
								'Quadro Kills': Math.floor(Math.random() * progressRatio * 1.5), // 0-1
								MVPs: mvps,
								Result: team2Score >= 16 ? 1 : 0,
								'Penta Kills': 0,
								'K/D Ratio': Number((kills / Math.max(deaths, 1)).toFixed(2)),
								Kills: kills,
								'Triple Kills': Math.floor(progressRatio * 2), // 0-2
								'K/R Ratio': Number((kills / Math.max(totalRounds, 1)).toFixed(2)),
								Headshots: headshots,
								Deaths: deaths,
								'Headshots %': Math.floor((headshots / Math.max(kills, 1)) * 100),
								Assists: Math.floor(progressRatio * 6) // 0-6 assists
							}
						};
					})
				}
			]
		}
	];

	return { details, stats };
}

// Generate randomized map stats per team for common maps
export function generateMapStatsForTeams(): mapStatsForTeams {
	const makeMap = (label: string) => {
		const mk = () => {
			const matches = Math.floor(Math.random() * 15) + 5; // 5-19
			const wins = Math.floor(Math.random() * (matches + 1));
			const winRate = Number(((wins / Math.max(matches, 1)) * 100).toFixed(1));
			return { Matches: matches, Wins: wins, 'Win Rate %': winRate } as mapStat;
		};
		return {
			label,
			img_regular: `https://example.com/${label.toLowerCase()}.jpg`,
			map_stats: [mk(), mk()] as [mapStat, mapStat]
		};
	};
	return {
		Inferno: makeMap('Inferno'),
		Mirage: makeMap('Mirage'),
		Dust2: makeMap('Dust2')
	};
}

// Always-new mock data generator that returns varying values on each call
export function generateAlwaysNewMockData(): { details: matchDetails; stats: matchStats[] } {
	const now = Date.now();
	const rounds = Math.floor(Math.random() * 30) + 1; // 1-30
	const scoreA = Math.floor(Math.random() * (rounds + 1));
	const scoreB = rounds - scoreA;
	const winner = scoreA === scoreB ? '' : scoreA > scoreB ? 'team1-id' : 'team2-id';
	const maps = ['de_inferno', 'de_mirage', 'de_dust2'];
	const picked = maps.slice();

	const details: matchDetails = {
		match_id: MOCK_MATCH_IDS.LIVE_UPDATING,
		competition_id: 'tournament-live' as tournamentId,
		competition_type: 'championship',
		competition_name: 'Live Demo Tournament',
		organizer_id: 'organizer-live' as organizerId,
		teams: {
			faction1: { ...mockTeam1, score: 0 },
			faction2: { ...mockTeam2, score: 0 }
		},
		voting: { map: { pick: picked } },
		round: 1,
		scheduled_at: now - 2 * 60 * 60 * 1000,
		configured_at: now - 90 * 60 * 1000,
		started_at: now - 60 * 60 * 1000,
		finished_at: 0,
		results: {
			winner,
			score: { faction1: scoreA > scoreB ? 1 : 0, faction2: scoreB > scoreA ? 1 : 0 }
		},
		status: 'ONGOING'
	};

	const mkPlayerStats = (bias = 0) => {
		const kills = Math.floor(5 + Math.random() * 20 + bias); // 5-25+
		const deaths = Math.floor(5 + Math.random() * 20 - bias / 2);
		const hs = Math.floor(kills * (0.3 + Math.random() * 0.3));
		return {
			'Quadro Kills': Math.floor(Math.random() * 3),
			MVPs: Math.floor(Math.random() * 6),
			Result: 0,
			'Penta Kills': Math.random() > 0.9 ? 1 : 0,
			'K/D Ratio': Number((kills / Math.max(deaths, 1)).toFixed(2)),
			Kills: kills,
			'Triple Kills': Math.floor(Math.random() * 4),
			'K/R Ratio': Number((kills / Math.max(rounds, 1)).toFixed(2)),
			Headshots: hs,
			Deaths: deaths,
			'Headshots %': Math.floor((hs / Math.max(kills, 1)) * 100),
			Assists: Math.floor(Math.random() * 10)
		};
	};

	const stats: matchStats[] = [
		{
			match_round: 1,
			played: false,
			round_stats: {
				Winner: winner as any,
				Rounds: rounds,
				Score: `${scoreA}-${scoreB}`,
				Map: maps[0]
			},
			teams: [
				{
					team_id: 'team1-id' as teamId,
					team_stats: {
						'Final Score': String(scoreA),
						'Team Win': winner === 'team1-id' ? '1' : ''
					},
					players: mockTeam1.roster.map((p) => ({
						player_id: p.player_id,
						nickname: p.nickname,
						avatar: p.avatar,
						player_stats: mkPlayerStats(1)
					}))
				},
				{
					team_id: 'team2-id' as teamId,
					team_stats: {
						'Final Score': String(scoreB),
						'Team Win': winner === 'team2-id' ? '1' : ''
					},
					players: mockTeam2.roster.map((p) => ({
						player_id: p.player_id,
						nickname: p.nickname,
						avatar: p.avatar,
						player_stats: mkPlayerStats(0)
					}))
				}
			]
		}
	];

	return { details, stats };
}

// Deterministic mock: one map finished, second not started
export function generateOnePlayedWaitingData(): { details: matchDetails; stats: matchStats[] } {
	const details = MOCK_MATCH_DETAILS[MOCK_MATCH_IDS.ONE_PLAYED_WAITING];
	const stats = MOCK_MATCH_STATS[MOCK_MATCH_IDS.ONE_PLAYED_WAITING];
	return { details, stats };
}
