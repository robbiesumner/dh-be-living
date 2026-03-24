<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	const { apartment } = $derived(data);
</script>

<div class="max-w-4xl mx-auto space-y-8">
	<!-- Hero Image & Title -->
	<div class="space-y-4">
		<div class="relative">
			<img
				class="h-[400px] w-full object-cover rounded-3xl shadow-xl"
				src="https://loremflickr.com/1200/800/apartment?lock={apartment.id}"
				alt={apartment.title}
			/>
			<div class="absolute top-4 left-4 flex gap-2">
				{#if apartment.isWG}
					<div class="badge badge-primary badge-lg font-bold shadow-lg p-4">WG-Zimmer</div>
				{:else}
					<div class="badge badge-secondary badge-lg font-bold shadow-lg p-4">
						Komplette Wohnung
					</div>
				{/if}
			</div>
		</div>

		<div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
			<div>
				<h1 class="text-4xl font-extrabold tracking-tight">{apartment.title}</h1>
				<p class="text-xl text-base-content/60 mt-1 flex items-center gap-2">
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
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{apartment.address}
				</p>
			</div>
			<div class="text-3xl font-bold text-primary">€{apartment.rentPrice} <span class="text-sm font-normal text-base-content/60">/ Monat</span></div>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm">
			<div class="stat-title">Größe</div>
			<div class="stat-value text-2xl">{apartment.size} m²</div>
		</div>
		<div class="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm">
			<div class="stat-title">Verfügbar ab</div>
			<div class="stat-value text-2xl">{formatDate(apartment.availableFrom)}</div>
		</div>
		<div class="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm">
			<div class="stat-title">Bis</div>
			<div class="stat-value text-2xl">{formatDate(apartment.availableTo)}</div>
		</div>
		<div class="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm">
			<div class="stat-title">Angebotstyp</div>
			<div class="stat-value text-2xl">{apartment.isWG ? 'WG' : 'Privat'}</div>
		</div>
	</div>

	<div class="grid md:grid-cols-3 gap-8">
		<!-- Left: Description -->
		<div class="md:col-span-2 space-y-6">
			<div class="card bg-base-100 border border-base-200 shadow-sm">
				<div class="card-body">
					<h2 class="card-title text-2xl mb-2">Beschreibung</h2>
					<p class="whitespace-pre-wrap leading-relaxed">{apartment.description}</p>
				</div>
			</div>

			<!-- Landlord Info -->
			<div class="card bg-base-200 shadow-inner">
				<div class="card-body">
					<h3 class="font-bold text-lg mb-4">Über den Anbieter</h3>
					<div class="flex items-center gap-4">
						<div class="avatar">
							<div class="w-16 rounded-full">
								<img src="https://loremflickr.com/200/200/face?lock={apartment.landlordId}" alt="Landlord" />
							</div>
						</div>
						<div>
							<div class="font-bold text-xl">{apartment.landlord.name}</div>
							<div class="text-sm opacity-60">
								{apartment.landlord.role} • {apartment.landlord.dhbwLocation || 'Kein Standort angegeben'}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Request Form -->
		<div class="space-y-4">
			<div class="card bg-base-100 border border-base-200 shadow-lg sticky top-8">
				<div class="card-body">
					<h2 class="card-title text-xl mb-4">Anfrage senden</h2>

					{#if form?.success}
						<div class="alert alert-success shadow-sm mb-4">
							<span>Deine Anfrage wurde erfolgreich gesendet!</span>
						</div>
					{:else}
						<form method="POST" action="?/request" use:enhance class="space-y-4">
							<div class="form-control">
								<label class="label" for="message">
									<span class="label-text">Nachricht</span>
								</label>
								<textarea
									id="message"
									name="message"
									class="textarea textarea-bordered h-32"
									placeholder="Stell dich kurz vor und sag, warum du einziehen möchtest..."
									required
								></textarea>
							</div>

							<button type="submit" class="btn btn-primary btn-block">
								Anfrage abschicken
							</button>

							<p class="text-xs text-center text-base-content/50 px-4">
								Wir benachrichtigen den Vermieter sofort über deine Nachricht.
							</p>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
