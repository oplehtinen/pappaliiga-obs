import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import { MOCK_MATCH_IDS } from '$lib/mockMatchData';
import type { matchStats as MatchStats } from '$lib/dataTypes';

// Mock the faceit module functions
vi.mock('$lib/faceit', () => ({
	getMatchDetails: vi.fn(),
	getMatchStats: vi.fn(),
	getOrganizerDetails: vi.fn(),
	getTeamStatsForMap: vi.fn(),
	getTournamentStatsForPlayer: vi.fn()
}));

import {
	getMatchDetails,
	getMatchStats,
	getOrganizerDetails,
	getTeamStatsForMap,
	getTournamentStatsForPlayer
} from '$lib/faceit';

describe('Match Data API - Dynamic Mock Mode', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Dynamic mock responses', () => {
		it('returns data in mock mode and varies between fetches', async () => {
			const id = MOCK_MATCH_IDS.LIVE_UPDATING;
			const url1 = new URL(`http://localhost/api/match-data?matchId=${id}&mock=true`);
			const url2 = new URL(`http://localhost/api/match-data?matchId=${id}&mock=true`);

			const res1 = await (GET as any)({ url: url1 });
			const data1 = await res1.json();
			const res2 = await (GET as any)({ url: url2 });
			const data2 = await res2.json();

			expect(res1.status).toBe(200);
			expect(res2.status).toBe(200);
			// Basic structure checks
			expect(data1.matchDetailsData.teams.faction1.roster).toHaveLength(5);
			expect(data1.matchDetailsData.teams.faction2.roster).toHaveLength(5);
			expect(Array.isArray(data1.matchStats)).toBe(true);
			expect(data1.mapStatsTeam).toBeDefined();
			// Variance checks
			expect(data1._nonce).not.toBe(data2._nonce);
		});
	});

	// Remove specific ongoing state tests; rely on dynamic checks

	// Remove finished state tests; dynamic mode has no fixed outcomes

	describe('Error States', () => {
		it('should return 400 error when matchId is missing', async () => {
			const mockUrl = new URL('http://localhost/api/match-data');
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error).toBe('Match ID is required');
		});

		it('should return 404 error when match is not found', async () => {
			const matchId = MOCK_MATCH_IDS.NOT_FOUND;

			vi.mocked(getMatchDetails).mockResolvedValue(null);

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(404);
			expect(data.error).toBe('Invalid match data received');
		});

		it('should return 404 error when match data is incomplete', async () => {
			const matchId = MOCK_MATCH_IDS.INVALID_DATA;

			// Mock incomplete match data (missing teams)
			vi.mocked(getMatchDetails).mockResolvedValue({
				match_id: matchId,
				competition_id: 'tournament-x' as any,
				competition_type: 'championship',
			best_of: 3,
			competition_name: 'X',
				organizer_id: 'org-x' as any,
				teams: null,
				voting: { map: { pick: [] } },
				round: 0,
				scheduled_at: 0,
				configured_at: 0,
				started_at: 0,
				finished_at: 0,
				results: { winner: '', score: { faction1: 0, faction2: 0 } },
				status: 'READY'
			});

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(404);
			expect(data.error).toBe('Invalid match data received');
		});

		it('should return 404 error when faction data is incomplete', async () => {
			const matchId = MOCK_MATCH_IDS.INVALID_DATA;

			// Mock incomplete faction data
			vi.mocked(getMatchDetails).mockResolvedValue({
				match_id: matchId,
				competition_id: 'tournament-x' as any,
				competition_type: 'championship',
			best_of: 3,
			competition_name: 'X',
				organizer_id: 'org-x' as any,
				teams: {
					faction1: {
						faction_id: 'team1-id',
						name: 'Team Alpha',
						avatar: '',
						roster: [
							{ player_id: 'p1', nickname: 'A1', avatar: '' },
							{ player_id: 'p2', nickname: 'A2', avatar: '' },
							{ player_id: 'p3', nickname: 'A3', avatar: '' },
							{ player_id: 'p4', nickname: 'A4', avatar: '' },
							{ player_id: 'p5', nickname: 'A5', avatar: '' }
						],
						score: 0
					},
					faction2: null as any
				},
				voting: { map: { pick: [] } },
				round: 0,
				scheduled_at: 0,
				configured_at: 0,
				started_at: 0,
				finished_at: 0,
				results: { winner: '', score: { faction1: 0, faction2: 0 } },
				status: 'READY'
			} as any);

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(404);
			expect(data.error).toBe('Incomplete team data');
		});

		it('should return 500 error when API calls fail', async () => {
			const matchId = 'real-match-id-for-error-test';

			vi.mocked(getMatchDetails).mockRejectedValue(new Error('API Error'));

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe('Failed to fetch match data');
		});

		it('should return 404 error for specific API 404 errors', async () => {
			const matchId = MOCK_MATCH_IDS.NOT_FOUND;

			vi.mocked(getMatchDetails).mockRejectedValue(new Error('404 Not Found'));

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(404);
			expect(data.error).toBe('Match not found');
		});

		it('should return 401 error for authentication failures', async () => {
			const matchId = 'real-match-id-for-auth-test';

			vi.mocked(getMatchDetails).mockRejectedValue(new Error('401 Unauthorized'));

			const mockUrl = new URL(`http://localhost/api/match-data?matchId=${matchId}`);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			expect(response.status).toBe(401);
			expect(data.error).toBe('API authentication failed');
		});
	});

	// Remove transition tests; dynamic mode has randomized outcomes

	describe('Data Consistency', () => {
		it('should maintain consistent team data across all endpoints', async () => {
			const mockUrl = new URL(
				`http://localhost/api/match-data?matchId=${MOCK_MATCH_IDS.LIVE_UPDATING}&mock=true`
			);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			// Verify team IDs are consistent across all data structures
			const matchTeam1Id = data.matchDetailsData.teams.faction1.faction_id;
			const matchTeam2Id = data.matchDetailsData.teams.faction2.faction_id;
			const statsTeam1Id = data.matchStats[0].teams[0].team_id;
			const statsTeam2Id = data.matchStats[0].teams[1].team_id;

			expect(matchTeam1Id).toBe(statsTeam1Id);
			expect(matchTeam2Id).toBe(statsTeam2Id);

			// Verify player counts are consistent
			const matchTeam1Players = data.matchDetailsData.teams.faction1.roster.length;
			const matchTeam2Players = data.matchDetailsData.teams.faction2.roster.length;
			const statsTeam1Players = data.matchStats[0].teams[0].players.length;
			const statsTeam2Players = data.matchStats[0].teams[1].players.length;

			expect(matchTeam1Players).toBe(5);
			expect(matchTeam2Players).toBe(5);
			expect(statsTeam1Players).toBe(5);
			expect(statsTeam2Players).toBe(5);
		});

		it('should have valid map stats processing', async () => {
			const mockUrl = new URL(
				`http://localhost/api/match-data?matchId=${MOCK_MATCH_IDS.LIVE_UPDATING}&mock=true`
			);
			const response = await (GET as any)({ url: mockUrl });
			const data = await response.json();

			// Check that picked maps are present
			expect(Array.isArray(data.pickedMaps)).toBe(true);

			// Check that map stats team data is present
			expect(data.mapStatsTeam).toBeDefined();
			expect(data.mapStatsTeam).toHaveProperty('Inferno');
			expect(data.mapStatsTeam).toHaveProperty('Mirage');
			expect(data.mapStatsTeam).toHaveProperty('Dust2');

			// Check that picked stats are processed
			expect(data.pickedStats).toBeDefined();
			expect(typeof data.pickedStats).toBe('object');
		});
	});
});
