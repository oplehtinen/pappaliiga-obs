<script>
import PickBanPhase from '$lib/components/PickBanPhase.svelte';
import MatchIdInput from '$lib/components/MatchIdInput.svelte';
</script>

<svelte:head>
<title>Pick/Ban Phase</title>
</svelte:head>
<div class="container mx-auto p-4">
<MatchIdInput pageType="pickban" />
<PickBanPhase />
</div>
