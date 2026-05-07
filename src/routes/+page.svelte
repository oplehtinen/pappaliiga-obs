<script lang="ts">
	import { base } from '$app/paths';
	// Front page offers links to input pages only; views require prior input
</script>

<svelte:head>
	<title>FACEIT OBS stats</title>
</svelte:head>

<div class="hero py-10">
	<div class="hero-content text-center">
		<div class="max-w-5xl">
			<h1 class="text-4xl md:text-5xl font-bold text-white mb-4">FACEIT OBS stats</h1>
			<p class="text-lg text-white/80 mb-8">
				FACEIT match statistics overlay system for streaming. View detailed match statistics, player
				performance data, and team comparisons.
			</p>
			<!-- Top-left GitHub button is provided by the layout on the home page -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div class="card card-compact bg-base-100 shadow-md">
					<div class="card-body">
						<h2 class="card-title text-base-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							Map Statistics
						</h2>
						<p class="text-base-content/70">Enter a match to see map-by-map breakdowns.</p>
						<div class="card-actions justify-end mt-2">
							<a href={`${base}/mapstats`} class="btn">Open</a>
						</div>
					</div>
				</div>

				<div class="card card-compact bg-base-100 shadow-md">
					<div class="card-body">
						<h2 class="card-title text-base-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Player Statistics
						</h2>
						<p class="text-base-content/70">Analyze K/D, ADR, headshots, and impact.</p>
						<div class="card-actions justify-end mt-2">
							<a href={`${base}/playerstats`} class="btn">Open</a>
						</div>
					</div>
				</div>

				<div class="card card-compact bg-base-100 shadow-md">
					<div class="card-body">
						<h2 class="card-title text-base-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5h2l3 7 3-7h2l-4 10H7L3 5m9 6h7m-7 4h7"
								/>
							</svg>
							Map Picks
						</h2>
						<p class="text-base-content/70">Pick/ban cards with win rates and next map.</p>
						<div class="card-actions justify-end mt-2">
							<a href={`${base}/mappicks`} class="btn">Open</a>
						</div>
					</div>
				</div>

				<div class="card card-compact bg-base-100 shadow-md">
					<div class="card-body">
						<h2 class="card-title text-base-content">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
								/>
							</svg>
							Pick/Ban Phase
						</h2>
						<p class="text-base-content/70">Live view of lobby pick/ban with all maps.</p>
						<div class="card-actions justify-end mt-2">
							<a href={`${base}/pickban`} class="btn">Open</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Showcase: mappicks screenshot -->
			<div class="my-8">
				<div class="rounded-lg overflow-hidden border border-white/10 shadow-md">
					<img
						src={`${base}/mappicks-sample.png`}
						alt="Map Picks Example"
						class="w-full object-cover"
					/>
				</div>
			</div>

			<!-- Demo banner -->
			<div class="alert bg-accent text-accent-content mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
					/>
				</svg>
				<span>Try the app with mock data.</span>
				<div class="ml-auto">
					<a href={`${base}/demo`} class="btn btn-sm">View Demo</a>
				</div>
			</div>

			<div class="card card-compact bg-base-100 backdrop-blur-sm border border-white/20">
				<div class="card-body">
					<h2 class="card-title text-white text-xl mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						How to Use
					</h2>
					<div class="text-left space-y-3 text-sm">
						<div class="step">
							<h3 class="font-semibold text-white">1. Get Match Data</h3>
							<p class="text-white/80">Open a page and enter a FACEIT match ID or full URL.</p>
						</div>
						<div class="step">
							<h3 class="font-semibold text-white">2. Supported Formats</h3>
							<p class="text-white/80">
								ID (e.g. <code class="bg-black/30 px-1 rounded">1-58d8d...</code>) or full FACEIT
								URL.
							</p>
						</div>
						<div class="step">
							<h3 class="font-semibold text-white">3. View</h3>
							<p class="text-white/80">You're redirected to the clean stats view automatically.</p>
						</div>
					</div>
				</div>
			</div>

			<!-- OBS Integration -->
			<div class="card card-compact bg-base-100 backdrop-blur-sm border border-white/20 mt-6">
				<div class="card-body">
					<h2 class="card-title text-white text-xl mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
						OBS Integration
					</h2>
					<div class="text-left space-y-2 text-sm">
						<p class="text-white/80">
							Use this app in OBS as a Browser Source. Start from an input page, enter your match,
							then copy the resulting URL into OBS.
						</p>
						<ol class="list-decimal list-inside space-y-1 text-white/90">
							<li>In OBS: Sources → + → Browser Source.</li>
							<li>Open a page, enter the match, then copy the resulting URL.</li>
							<li>Set size to match your canvas (e.g., 1920×1080), then add.</li>
						</ol>
						<p class="text-white/60 text-xs">
							Tip: Use “Refresh cache of current page” to reload, or enable “Shutdown source when
							not visible” to reset between scenes.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Input pages: /mapstats, /playerstats, /mappicks -->
