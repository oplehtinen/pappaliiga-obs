import { json, type RequestHandler } from '@sveltejs/kit';
import {
	getMatchDetails,
	getMatchStats,
	getOrganizerDetails,
	getTeamStatsForMap,
	getTournamentStatsForPlayer,
	getMapPoolEntities
} from '$lib/faceit';
import type { matchId } from '$lib/dataTypes';
import { MOCK_ORGANIZER_DATA, MOCK_MATCH_IDS } from '$lib/mockMatchData';
import {
	generatePlayerTournamentStats,
	generateMapStatsForTeams,
	generateAlwaysNewMockData,
	generateOnePlayedWaitingData
} from '$lib/mockMatchData';

export const GET: RequestHandler = async ({ url }) => {
	const matchId = url.searchParams.get('matchId');
	const useMockData = url.searchParams.get('mock') === 'true';

	if (!matchId) {
		return json({ error: 'Match ID is required' }, { status: 400 });
	}

	// Handle mock data requests (dynamic or scenario-specific)
	if (useMockData) {
		try {
			const { details: mockMatchDetails, stats: mockMatchStats } =
				matchId === MOCK_MATCH_IDS.ONE_PLAYED_WAITING
					? generateOnePlayedWaitingData()
					: generateAlwaysNewMockData();
			const teamsData = mockMatchDetails.teams;
			const organizerData = MOCK_ORGANIZER_DATA;
			const playerStats = generatePlayerTournamentStats();
			const mapStatsTeam = generateMapStatsForTeams();
			const pickedMaps = mockMatchDetails.voting?.map?.pick || [];
			const pickedStats: { [n: number]: unknown } = {};

			// Process picked stats for mock data
			for (const key in mapStatsTeam) {
				const mapName = 'de_'.concat(key.toLowerCase());
				for (let i = 0; i < pickedMaps.length; i++) {
					if (pickedMaps[i] === mapName) {
						pickedStats[i] = mapStatsTeam[key as keyof typeof mapStatsTeam];
					}
				}
			}

			return json({
				mapStatsTeam,
				pickedMaps,
				pickedStats,
				matchDetailsData: mockMatchDetails,
				organizerData,
				teamsData,
				playerStats,
				matchStats: mockMatchStats,
				_mockData: true,
				_nonce: Date.now()
			});
		} catch (error) {
			console.error('Error serving mock data:', error);
			return json({ error: 'Failed to generate mock data' }, { status: 500 });
		}
	}

	try {
		// Get all the match data similar to what +layout.server.ts does
		const matchDetailsData = await getMatchDetails(matchId as matchId);

		// Validate that match details and teams data exist
		if (!matchDetailsData || !matchDetailsData.teams) {
			return json({ error: 'Invalid match data received' }, { status: 404 });
		}

		const teamsData = matchDetailsData.teams;

		// Validate that both factions exist
		if (!teamsData.faction1 || !teamsData.faction2) {
			return json({ error: 'Incomplete team data' }, { status: 404 });
		}

		const organizerData = await getOrganizerDetails(matchDetailsData.organizer_id);
		const playerStats = await getTournamentStatsForPlayer(
			matchDetailsData.competition_id,
			teamsData
		);

		const mapPool = await getMapPoolEntities(matchDetailsData);
		const teamArr = [teamsData.faction1, teamsData.faction2];
		const mapStatsTeam = await getTeamStatsForMap(teamArr, mapPool);
		const pickedMaps = matchDetailsData.voting?.map?.pick || [];
		const pickedStats: { [n: number]: unknown } = {};
		const matchStats = await getMatchStats(matchId as matchId);

		// Process picked stats similar to +layout.server.ts
		for (const key in mapStatsTeam) {
			const mapName = 'de_'.concat(key.toLowerCase());
			for (let i = 0; i < pickedMaps.length; i++) {
				if (pickedMaps[i] === mapName) {
					pickedStats[i] = mapStatsTeam[key as keyof typeof mapStatsTeam];
				}
			}
		}

		return json({
			mapStatsTeam,
			pickedMaps,
			pickedStats,
			matchDetailsData,
			organizerData,
			teamsData,
			playerStats,
			matchStats
		});
	} catch (error) {
		console.error('Error fetching match data:', error);

		// Provide more specific error messages based on the error type
		if (error instanceof Error) {
			if (error.message.includes('404') || error.message.includes('Not Found')) {
				return json({ error: 'Match not found' }, { status: 404 });
			}
			if (error.message.includes('401') || error.message.includes('Unauthorized')) {
				return json({ error: 'API authentication failed' }, { status: 401 });
			}
		}

		return json({ error: 'Failed to fetch match data' }, { status: 500 });
	}
};
