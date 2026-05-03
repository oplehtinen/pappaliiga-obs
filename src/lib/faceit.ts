import { FACEIT_API_KEY } from '$env/static/private';
import type {
	mapData,
	mapName,
	mapPoolEntity,
	mapStat,
	mapStatsForTeams,
	matchDetails,
	matchId,
	matchStats,
	playerStat,
	team,
	teamId,
	teams,
	teamStats,
	tournamentDetails,
	tournamentId
} from './dataTypes';

import { maps as staticMapData } from './maps';

const faceitAPI = async (endpoint: string, log?: boolean) => {
	const response = await fetch(`https://open.faceit.com/data/v4/${endpoint}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${FACEIT_API_KEY}`,
			Accept: 'application/json'
		}
	});
	const json = await response.json();
	// if error, log it
	if (json.error) {
		console.error('endpoint FAILED:' + endpoint);
		console.error(json.error);
		return json;
	}

	if (log) {
		console.log(json.body);
	}

	return json;
};

const getMatchDetails = async (id: matchId): Promise<matchDetails | null> => {
	const endpoint = `matches/${id}`;
	const data = await faceitAPI(endpoint);
	return data;
};

const getTournamentDetails = async (tournamentId: string): Promise<tournamentDetails> => {
	const endpoint = `championships/${tournamentId}`;
	const data = await faceitAPI(endpoint);
	return data;
};

const getOrganizerDetails = async (organizerId: string) => {
	const endpoint = `organizers/${organizerId}`;
	const data = await faceitAPI(endpoint);
	return data;
};

const getMatchStats = async (matchId: matchId): Promise<matchStats[]> => {
	const endpoint = `matches/${matchId}/stats`;
	const data = await faceitAPI(endpoint);
	return data.rounds;
};

const getTournamentStatsForPlayer = async (
	tournamentId: tournamentId,
	teams: teams
): Promise<teams> => {
	const endpoint = `hubs/${tournamentId}/stats?offset=0&limit=100`;
	const data = await faceitAPI(endpoint);

	// for each team, get the player stats
	if (teams && teams.faction1) {
		for (let i = 0; i < teams.faction1.roster.length; i++) {
			const player = teams.faction1.roster[i];
			if (!data.players) continue;
			const playerStats = data.players.find(
				(p: { [key: string]: any }) => p.player_id === player.player_id
			)?.stats;
			teams.faction1.roster[i].stats = playerStats;
		}
	}
	if (teams && teams.faction2) {
		for (let i = 0; i < teams.faction2.roster.length; i++) {
			const player = teams.faction2.roster[i];
			if (!data.players) continue;
			const playerStats = data.players.find(
				(p: { [key: string]: any }) => p.player_id === player.player_id
			)?.stats;
			teams.faction2.roster[i].stats = playerStats;
		}
	}
	return teams;
};
const teamMapData = async (teamId: teamId): Promise<mapData[]> => {
	const endpoint = `teams/${teamId}/stats/cs2`;
	const data = await faceitAPI(endpoint);

	const maps = data?.segments || [];

	return maps;
};

const getMapPoolFromCompetition = async (
	competitionId: string,
	competitionType: string
): Promise<mapPoolEntity[]> => {
	const base = competitionType === 'hub' ? 'hubs' : 'championships';
	const data = await faceitAPI(`${base}/${competitionId}/matches?type=past&limit=10`);
	for (const match of data.items || []) {
		const entities: mapPoolEntity[] | undefined = match.voting?.map?.entities;
		if (entities?.length) return entities;
	}
	return [];
};

const getMapPoolEntities = async (matchDetails: matchDetails): Promise<mapPoolEntity[]> => {
	if (matchDetails.voting?.map?.entities?.length) {
		return matchDetails.voting.map.entities;
	}
	if (matchDetails.competition_id && matchDetails.competition_type) {
		const entities = await getMapPoolFromCompetition(
			matchDetails.competition_id,
			matchDetails.competition_type
		);
		if (entities.length) return entities;
	}
	// Final fallback: use hardcoded map pool with static image data
	return Object.entries(staticMapData).map(([name, data]) => ({
		name,
		class_name: data.class_name,
		game_map_id: data.game_map_id,
		guid: data.guid,
		image_lg: data.image_lg,
		image_sm: data.image_sm
	}));
};

const getTeamStatsForMaps = async (
	teams: team[],
	mapEntities: mapPoolEntity[]
): Promise<mapStatsForTeams> => {
	// for each team, get the map stats
	const createMapStats = async (): Promise<mapStatsForTeams> => {
		const mapStats: mapStatsForTeams = {};
		const emptyMapStat: mapStat = {
			Matches: 0,
			Wins: 0,
			'Win Rate %': 0
		};
		// Initialise map pool entries using API-provided image URLs
		for (const entity of mapEntities) {
			mapStats[entity.name] = {
				label: entity.name,
				img_regular: entity.image_lg,
				map_stats: [emptyMapStat, emptyMapStat]
			};
		}
		const poolNames = mapEntities.map((e) => e.name);
		for (let i = 0; i < teams.length; i++) {
			const team = teams[i];
			if (!team || !team.faction_id) break;
			const maps = await teamMapData(team.faction_id);
			for (const map of maps) {
				const mapName = map.label as mapName;
				if (!poolNames.includes(mapName)) continue;
				if (!(map && map.stats && map.stats.Matches)) continue;
				const mapStat: mapStat = {
					Matches: parseFloat(map.stats.Matches as unknown as string),
					Wins: parseFloat(map.stats.Wins as unknown as string),
					'Win Rate %': map.stats['Win Rate %']
				};
				if (!mapStats[mapName].map_stats) continue;
				mapStats[mapName].map_stats[i] = mapStat;
			}
		}
		return mapStats;
	};

	const mapStats = await createMapStats();

	// loop through the maps, if there is only 1 team, add the other team's stats as 0
	for (const map in mapStats) {
		const mapStat = mapStats[map];
		if (!mapStat.map_stats) continue;
		if (mapStat.map_stats[0].Matches == -1 && mapStat.map_stats[1].Matches == -1) {
			delete mapStats[map];
		}
	}

	return mapStats;
};

export {
	getMatchDetails,
	getTournamentDetails,
	getOrganizerDetails,
	getMatchStats,
	getTournamentStatsForPlayer,
	getMapPoolEntities,
	getTeamStatsForMaps as getTeamStatsForMap
};
