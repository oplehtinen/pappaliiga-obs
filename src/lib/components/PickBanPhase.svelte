<script lang="ts">
	import Avatar from './Avatar.svelte';
	import { fly } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';
	import type { matchDetails, team } from '$lib/dataTypes';
	import { maps as staticMapData } from '$lib/maps';
	import {
		currentMatchId,
		teamsDataStore,
		matchDetailsDataStore,
		loadingStore,
		errorStore,
		useMockData
	} from '../../stores';

	let match: matchDetails | null = null;
	let teamArr: team[] = [];
	let loading = false;
	let error = '';
	let isMockData = false;

	// Subscribe to centralized stores
	$: match = $matchDetailsDataStore as matchDetails | null;
	$: teamArr = $teamsDataStore
		? ([$teamsDataStore.faction1, $teamsDataStore.faction2] as team[])
		: [];
	$: loading = $loadingStore;
	$: error = $errorStore;
	$: isMockData = $useMockData;

	// Get all available maps from voting entities or picked maps
	$: allMaps = match?.voting?.map?.entities || [];
	$: pickedMaps = match?.voting?.map?.pick || [];

	interface MapWithStatus {
		guid: string;
		name: string;
		image_lg: string;
		image_sm: string;
		class_name: string;
		game_map_id: string;
		status: 'picked' | 'banned';
		pickIndex?: number;
		teamIndex?: number; // 0 or 1 for faction1 or faction2
	}

	// Process maps with pick/ban status and team attribution
	$: processedMaps = (() => {
		const maps: MapWithStatus[] = [];
		
		if (allMaps.length > 0) {
			// Use entities data
			allMaps.forEach((mapEntity) => {
				const pickIndex = pickedMaps.indexOf(mapEntity.guid);
				const isPicked = pickIndex >= 0;
				
				// Simulate team attribution based on pick order (alternating teams)
				// TODO: Update this when FACEIT API provides team attribution data in voting object
				let teamIndex: number | undefined;
				if (isPicked) {
					teamIndex = pickIndex % 2; // Alternate between teams
				} else {
					// For bans, also alternate
					const bannedIndex = allMaps.filter(m => !pickedMaps.includes(m.guid)).indexOf(mapEntity);
					teamIndex = bannedIndex % 2;
				}
				
				maps.push({
					guid: mapEntity.guid,
					name: mapEntity.name,
					image_lg: mapEntity.image_lg,
					image_sm: mapEntity.image_sm,
					class_name: mapEntity.class_name,
					game_map_id: mapEntity.game_map_id,
					status: isPicked ? 'picked' : 'banned',
					pickIndex: isPicked ? pickIndex : undefined,
					teamIndex
				});
			});
		} else if (pickedMaps.length > 0) {
			// Fallback to picked maps only
			pickedMaps.forEach((mapGuid, index) => {
				const mapName = mapGuid.replace('de_', '');
				const capitalizedName = mapName.charAt(0).toUpperCase() + mapName.slice(1);
				const mapKey = capitalizedName as keyof typeof staticMapData;
				const mapInfo = staticMapData[mapKey];

				maps.push({
					guid: mapGuid,
					name: capitalizedName,
					image_lg: mapInfo?.image_lg || '',
					image_sm: mapInfo?.image_sm || '',
					class_name: mapGuid,
					game_map_id: mapGuid,
					status: 'picked',
					pickIndex: index,
					teamIndex: index % 2
				});
			});
		}
		
		return maps;
	})();

	// Sort: picks first (by index), then bans
	$: sortedMaps = [...processedMaps].sort((a, b) => {
		if (a.status === 'picked' && b.status === 'picked') {
			return (a.pickIndex ?? 0) - (b.pickIndex ?? 0);
		}
		if (a.status === 'picked') return -1;
		if (b.status === 'picked') return 1;
		return 0;
	});

	// Get background color based on status
	const getStatusClass = (status: 'picked' | 'banned') => {
		return status === 'picked' ? 'before:!bg-success-content' : 'before:!bg-error-content';
	};

	// Get status text
	const getStatusText = (status: 'picked' | 'banned', pickIndex?: number) => {
		if (status === 'picked' && pickIndex !== undefined) {
			return `PICK ${pickIndex + 1}`;
		}
		return status === 'picked' ? 'PICKED' : 'BANNED';
	};
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
		<span>Please enter a match ID above to load pick/ban phase.</span>
	</div>
{:else if sortedMaps.length > 0}
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

	<div class="flex flex-wrap justify-around flex-row my-auto gap-4 mx-auto w-5/6 h-5/6">
		{#each sortedMaps as map, i (map.guid)}
			<div class="m-2">
				<div
					class="card shadow-xl before:!bg-opacity-90 grid min-h-16 shrink image-full flex-1 {getStatusClass(
						map.status
					)}"
					in:fly={{ y: -150, duration: Math.min(i * 300, 900), easing: expoIn }}
					out:fly={{ y: 150, duration: 500, easing: expoOut }}
				>
					<figure><img src={map.image_lg} class="w-full" alt={map.name} /></figure>
					<div class="card-body justify-end">
						<h1 class="text-4xl text-primary capitalize">
							{map.name}
							<div class="badge badge-lg {map.status === 'picked' ? 'badge-success' : 'badge-error'}">
								{getStatusText(map.status, map.pickIndex)}
							</div>
						</h1>
						{#if teamArr.length === 2 && map.teamIndex !== undefined}
							<div class="stats bg-base-200 bg-opacity-80">
								<div class="stat flex flex-row items-center">
									<div class="stat-figure">
										<div class="w-16 rounded-full overflow-hidden">
											<Avatar
												src={teamArr[map.teamIndex].avatar}
												alt={teamArr[map.teamIndex].name + ' logo'}
												text={teamArr[map.teamIndex].name}
											/>
										</div>
									</div>
									<div class="stat-title text-lg">
										{map.status === 'picked' ? 'Picked by' : 'Banned by'}
										{teamArr[map.teamIndex].name}
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="alert alert-warning">
		<span>No map data available for this match.</span>
	</div>
{/if}
