import { PUBLIC_MATCHID } from "$env/static/public";
import type { matchId } from "$lib/dataTypes";
import { getMatchDetails, getMatchStats, getOrganizerDetails, getTeamStatsForMap, getTournamentStatsForPlayer } from "$lib/faceit";
const matchDetailsData = await getMatchDetails(PUBLIC_MATCHID as matchId);

const organizerData = await getOrganizerDetails(matchDetailsData.organizer_id);

const teamsData = matchDetailsData.teams;

const playerStats = await getTournamentStatsForPlayer(matchDetailsData.competition_id, teamsData);
const tournamentMaps = [
    'Inferno',
    'Train',
    'Ancient',
    'Mirage',
    'Nuke',
    'Dust2',
    'Anubis'
]
const teamArr = [teamsData.faction1, teamsData.faction2];
const mapStatsTeam = await getTeamStatsForMap(teamArr, tournamentMaps);
const pickedMaps = matchDetailsData.voting?.map?.pick || []; // array of mapNames
const pickedStats: { [n: number]: unknown } = {}
const matchStats = await getMatchStats(PUBLIC_MATCHID as matchId);
for (const key in mapStatsTeam) {
    // compare key to values in pickedMaps array. 
    // pickedmaps will have de_ prefix, mapStatsTeam will not
    console.log('key: ' + key);
    const mapName = 'de_'.concat(key.toLowerCase());
    for (let i = 0; i < pickedMaps.length; i++) {
        if (pickedMaps[i] === mapName) {
            pickedStats[i] = mapStatsTeam[key];
        }
    }
}
export async function load() {
    return {
        mapStatsTeam,
        pickedMaps,
        pickedStats,
        matchDetailsData,
        organizerData,
        teamsData,
        playerStats,
        matchStats
    }
}
