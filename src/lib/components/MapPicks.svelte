<script lang="ts">
	import MapCard from './MapCard.svelte';
	import type { mapData, matchDetails, team } from '$lib/dataTypes';
	import {
		currentMatchId,
		teamsDataStore,
		matchDetailsDataStore,
		pickedStatsStore,
		matchStatsStore,
		loadingStore,
		errorStore,
		useMockData
	} from '../../stores';

	let match: matchDetails | null = null;
	let teamArr: team[] = [];
	let loading = false;
	let error = '';
	let isMockData = false;

	// Picked stats keyed by pick index (0,1,2,...)
	let pickedStats: Record<number, mapData> = {};
	let enrichedPicks: Record<number, mapData> = {};
	let pickedEntries: [string, mapData][] = [];
	let roundsPlayed = 0;

	// Subscribe to centralized stores
	$: match = $matchDetailsDataStore as matchDetails | null;
	$: teamArr = $teamsDataStore
		? ([$teamsDataStore.faction1, $teamsDataStore.faction2] as team[])
		: [];
	$: loading = $loadingStore;
	$: error = $errorStore;
	$: isMockData = $useMockData;
	$: pickedStats = ($pickedStatsStore as unknown as Record<number, mapData>) || {};
	$: roundsPlayed = match?.results?.score
		? match.results.score.faction1 + match.results.score.faction2
		: 0;

	// Enrich picked stats with played and round stats information from matchStatsStore
	$: enrichedPicks = (() => {
		const result: Record<number, mapData> = {};
		const ms = $matchStatsStore ?? [];
		for (const [k, v] of Object.entries(pickedStats || {})) {
			const i = Number(k);
			const map: mapData = { ...(v as mapData) };
			if (Array.isArray(ms) && ms[i] && i < roundsPlayed) {
				// Attach per-round team stats and mark as played
				map.round_stats = ms[i].teams;
				map.played = true;
			}
			result[i] = map;
		}
		return result;
	})();

	// Stable ordered entries for rendering
	$: pickedEntries = Object.entries(enrichedPicks).sort((a, b) => Number(a[0]) - Number(b[0])) as [
		string,
		mapData
	][];
</script>

{#if loading}
	<div class="flex justify-center items-center p-8">
		<div class="loading loading-spinner loading-lg"></div>
		<span class="ml-4">Loading match data...</span>
	</div>
{:else if error}
	<div class="alert alert-error">
		<span>Error: {error}</span>
	</div>
{:else if !$currentMatchId}
	<div class="alert alert-info">
		<span>Please enter a match ID above to load map picks.</span>
	</div>
{:else if pickedEntries.length > 0}
	{#if isMockData}
		<div class="alert alert-info mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Demo Mode: This data is simulated for demonstration purposes.</span>
		</div>
	{/if}

	<div class="flex flex-wrap h-1/5 flex-row">
		{#each pickedEntries as [key, map], i (key)}
			{#if match && match.status == 'FINISHED' && i >= roundsPlayed}
				<!-- Skip maps that were never played (e.g. a 2-0 sweep in a BO3) -->
			{:else}
				<MapCard
					data={map}
					playedMap={map.played}
					order={i * 300}
					teams={teamArr}
					nextMap={roundsPlayed == i}
					picks={true}
				/>
				{#if i == 0 && pickedEntries.length > 1}
					<div class="divider text-primary divider-horizontal">&</div>
				{/if}
				{#if i == 1 && pickedEntries.length > 2}
					<div class="divider text-primary divider-horizontal">?</div>
				{/if}
			{/if}
		{/each}
	</div>
{:else}
	<div class="skeleton flex flex-wrap h-1/5 w-6/6 opacity-40 flex-row"></div>
{/if}
