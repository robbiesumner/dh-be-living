<script lang="ts">
	import SearchBar from '$lib/SearchBar.svelte';
	let { data } = $props();
	const user = $derived(data.user);
</script>

<div class="flex flex-col gap-6">
	<div class="card bg-base-200 shadow-sm p-12 flex flex-col items-center gap-6">
		<h2 class="text-4xl font-extrabold text-center">Dein zweites Zuhause finden.</h2>
		<div class="w-full max-w-md">
			<SearchBar />
		</div>
		<div class="flex flex-wrap gap-4 justify-center mt-4">
			<a href="/search" class="btn btn-primary btn-lg">Alle Wohnungen durchsuchen</a>
			
			{#if user && (user.role === 'landlord' || user.role === 'both')}
				<a href="/apartment/new" class="btn btn-outline btn-lg">Angebot erstellen</a>
			{/if}
		</div>
	</div>

	{#if !user}
		<div class="alert alert-info">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<span>Möchtest du ein Zimmer anbieten? <a href="/login" class="link font-bold text-primary">Melde dich an</a>, um Angebote zu erstellen!</span>
		</div>
	{/if}
</div>
