<script lang="ts">
	import { resolve } from '$app/paths';
	import SearchBar from '$lib/SearchBar.svelte';
	import { formatDate } from '$lib/utils';
	let { data } = $props();
</script>

<div class="mb-8 flex flex-col items-center">
	<SearchBar value={data.searchQuery || ''} />
</div>

<div class="mb-4">
	{#if data.searchQuery}
		<h2 class="text-xl font-bold">
			Ergebnisse für: <span class="text-primary">"{data.searchQuery}"</span>
		</h2>
		<a href={resolve('/search')} class="text-sm text-base-content/50 hover:underline">
			Suche zurücksetzen
		</a>
	{:else}
		<h2 class="text-xl font-bold">Alle Wohnungen</h2>
	{/if}
</div>

{#if data.listings.length === 0}
	<div class="alert alert-info shadow-sm">Keine passenden Wohnungen gefunden!</div>
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
