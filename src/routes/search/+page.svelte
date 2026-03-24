<script lang="ts">
	import { resolve } from '$app/paths';
	import SearchBar from '$lib/SearchBar.svelte';
	import { formatDate } from '$lib/utils';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	let { data } = $props();

	let filters = $state({
		dhbwLocation: data.filters.dhbwLocation || '',
		workLocation: data.filters.workLocation || '',
		isWG: data.filters.isWG
	});

	function applyFilters() {
		const url = new URL(page.url);
		if (filters.dhbwLocation) url.searchParams.set('dhbwLocation', filters.dhbwLocation);
		else url.searchParams.delete('dhbwLocation');

		if (filters.workLocation) url.searchParams.set('workLocation', filters.workLocation);
		else url.searchParams.delete('workLocation');

		url.searchParams.set('isWG', filters.isWG.toString());
		goto(url.toString(), { keepFocus: true });
	}

	const activeLocations = [data.filters.dhbwLocation, data.filters.workLocation].filter(Boolean);
</script>

<div class="mb-8 flex flex-col items-center gap-4 w-full">
	<SearchBar value={data.searchQuery || ''} />

	<div class="card bg-base-100 border border-base-200 w-full max-w-2xl shadow-sm">
		<div class="card-body p-4">
			<div class="flex flex-wrap items-end gap-4">
				<div class="form-control w-full sm:w-auto flex-1">
					<label class="label p-1" for="dhbwLocation">
						<span class="label-text text-xs font-semibold opacity-70">DHBW Standort</span>
					</label>
					<input
						type="text"
						id="dhbwLocation"
						bind:value={filters.dhbwLocation}
						placeholder="Karlsruhe"
						class="input input-bordered input-sm w-full"
						onchange={applyFilters}
					/>
				</div>

				<div class="form-control w-full sm:w-auto flex-1">
					<label class="label p-1" for="workLocation">
						<span class="label-text text-xs font-semibold opacity-70">Partner Standort</span>
					</label>
					<input
						type="text"
						id="workLocation"
						bind:value={filters.workLocation}
						placeholder="Berlin"
						class="input input-bordered input-sm w-full"
						onchange={applyFilters}
					/>
				</div>

				<div class="form-control">
					<label class="label cursor-pointer flex-col items-start p-1" for="isWG">
						<span class="label-text text-xs font-semibold opacity-70 mb-1">WG-Zimmer?</span>
						<input
							type="checkbox"
							id="isWG"
							bind:checked={filters.isWG}
							class="toggle toggle-primary toggle-sm"
							onchange={applyFilters}
						/>
					</label>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="mb-4">
	{#if data.searchQuery}
		<h2 class="text-xl font-bold">
			Ergebnisse für: <span class="text-primary">"{data.searchQuery}"</span>
		</h2>
		<a href={resolve('/search')} class="text-sm text-base-content/50 hover:underline">
			Suche zurücksetzen
		</a>
	{:else if activeLocations.length > 0}
		<h2 class="text-xl font-bold">
			Wohnungen für dich in <span class="text-primary">{activeLocations.join(' & ')}</span>
		</h2>
		<p class="text-sm text-base-content/60">
			Gefiltert nach Standorten und WG-Präferenz ({data.filters.isWG ? 'WG' : 'Nicht-WG'})
		</p>
	{:else}
		<h2 class="text-xl font-bold">Alle Wohnungen</h2>
		<p class="text-sm text-base-content/60">
			Präferenz: {data.filters.isWG ? 'WG' : 'Nicht-WG'}
		</p>
	{/if}
</div>

{#if data.listings.length === 0}
	<div class="alert alert-info shadow-sm">
		Keine passenden Wohnungen gefunden!
		{#if activeLocations.length > 0 && !data.searchQuery}
			Versuche es mit einer manuellen Suche oder passe die Filter an.
		{/if}
	</div>
{:else}
	<div class="flex flex-col gap-6">
		{#each data.listings as listing (listing.id)}
			<a href={resolve(`/apartment/${listing.id}`)} class="card bg-base-200">
				<figure>
					<img
						class="h-56 w-full object-cover text-transparent"
						src="https://loremflickr.com/600/400/apartment?lock={listing.id}"
						alt={listing.title}
					/>
				</figure>

				<div class="card-body">
					<h2 class="card-title text-xl">{listing.title}</h2>

					<div class="flex flex-wrap items-center gap-4 text-sm">
						<div>
							{listing.availableFrom.toLocaleDateString()} - {listing.availableTo.toLocaleDateString()}
						</div>
						<div>
							€{listing.rentPrice}
						</div>
						<div>
							{listing.size} m²
						</div>
					</div>

					<div class="text-secondary">
						{listing.address}
					</div>
				</div>
			</a>
		{/each}
	</div>
{/if}
