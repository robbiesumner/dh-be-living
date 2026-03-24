<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	let profile = $derived(data.profile);

	let isSaving = $state(false);
	let activeTab = $state('settings');

	$effect(() => {
		if (activeTab === 'listings' && profile.role === 'tenant') {
			activeTab = 'settings';
		}
		if (activeTab === 'requests' && profile.role === 'landlord') {
			activeTab = 'settings';
		}
	});
</script>

<div class="flex flex-col gap-6">
	<header class="flex items-center gap-6">
		<div class="avatar online">
			<div class="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
				<img src="https://loremflickr.com/200/200/face?lock={profile.id}" alt="User Avatar" />
			</div>
		</div>
		<div>
			<h2 class="text-3xl font-bold">{profile.name}</h2>
			<p class="text-base-content/60 capitalize">
				{profile.role} • Mitglied seit {new Date(profile.createdAt).toLocaleDateString()}
			</p>
		</div>
	</header>

	{#if form?.success}
		<div role="alert" class="alert alert-success shadow-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Profil erfolgreich geändert!</span>
		</div>
	{/if}

	{#if form?.message && !form?.success}
		<div role="alert" class="alert alert-error shadow-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{form.message}</span>
		</div>
	{/if}

	<div class="card bg-base-100 border border-base-200">
		<div class="card-body">
			<h3 class="card-title mb-4">Profileinstellungen</h3>

			<div role="tablist" class="tabs tabs-lifted mb-4">
				<button
					type="button"
					role="tab"
					class="tab {activeTab === 'settings' ? 'tab-active' : ''}"
					onclick={() => (activeTab = 'settings')}
				>
					Allgemeine Einstellungen
				</button>

				{#if profile.role === 'landlord' || profile.role === 'both'}
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'listings' ? 'tab-active' : ''}"
						onclick={() => (activeTab = 'listings')}
					>
						Meine Angebote ({profile.apartments.length})
					</button>
				{/if}

				{#if profile.role === 'tenant' || profile.role === 'both'}
					<button
						type="button"
						role="tab"
						class="tab {activeTab === 'requests' ? 'tab-active' : ''}"
						onclick={() => (activeTab = 'requests')}
					>
						Meine Anfragen ({profile.requests.length})
					</button>
				{/if}
			</div>

			{#if activeTab === 'settings'}
				<form
					method="POST"
					use:enhance={() => {
						isSaving = true;
						return async ({ update }) => {
							isSaving = false;
							update({ reset: false });
						};
					}}
					class="flex flex-col gap-4"
				>
					<div class="form-control w-full">
						<label class="label" for="name">
							<span class="label-text font-semibold">Name</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form?.name ?? profile.name}
							placeholder="Max Mustermann"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<div class="form-control w-full">
						<label class="label" for="phone">
							<span class="label-text font-semibold">Telefonnummer</span>
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={form?.phone ?? profile.phone}
							placeholder="+49 123 4567890"
							class="input input-bordered w-full"
						/>
					</div>

					<div class="form-control w-full">
						<label class="label" for="role">
							<span class="label-text font-semibold">Profiltyp</span>
						</label>
						<select
							id="role"
							name="role"
							class="select select-bordered w-full"
							value={form?.role ?? profile.role}
						>
							<option value="tenant">Mieter (Ich suche eine Wohnung)</option>
							<option value="landlord">Vermieter (Ich biete eine Wohnung an)</option>
							<option value="both">Beides</option>
						</select>
					</div>

					{#if profile.role === 'tenant' || profile.role === 'both'}
						<div class="form-control w-full">
							<label class="label" for="dhbwLocation">
								<span class="label-text font-semibold">DHBW Standort</span>
							</label>
							<input
								type="text"
								id="dhbwLocation"
								name="dhbwLocation"
								value={form?.dhbwLocation ?? profile.dhbwLocation}
								placeholder="Karlsruhe"
								class="input input-bordered w-full"
							/>
						</div>

						<div class="form-control w-full">
							<label class="label" for="dhbwCourse">
								<span class="label-text font-semibold">DHBW Kurs</span>
							</label>
							<input
								type="text"
								id="dhbwCourse"
								name="dhbwCourse"
								value={form?.dhbwCourse ?? profile.dhbwCourse}
								placeholder="WWI24B2"
								class="input input-bordered w-full"
							/>
						</div>

						<div class="form-control w-full">
							<label class="label" for="workLocation">
								<span class="label-text font-semibold">Standort Praxispartner</span>
							</label>
							<input
								type="text"
								id="workLocation"
								name="workLocation"
								value={form?.workLocation ?? profile.workLocation}
								placeholder="Berlin"
								class="input input-bordered w-full"
							/>
						</div>

						<div class="divider">Präferenzen</div>

						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-4">
								<input
									type="checkbox"
									id="acceptWG"
									name="acceptWG"
									class="toggle toggle-primary"
									checked={form?.acceptWG ?? profile.acceptWG}
								/>
								<span class="label-text font-semibold">WG-geeignet?</span>
							</label>
						</div>
					{/if}

					<div class="card-actions justify-end mt-4">
						<button type="submit" class="btn btn-primary" disabled={isSaving}>
							{#if isSaving}
								<span class="loading loading-spinner"></span>
								Speichern...
							{:else}
								Änderungen speichern
							{/if}
						</button>
					</div>
				</form>
			{:else if activeTab === 'listings'}
				<div class="flex flex-col gap-4">
					{#if profile.apartments.length === 0}
						<div class="text-center py-8 bg-base-200/30 rounded-lg">
							<p class="text-base-content/50">Du hast noch keine Angebote erstellt.</p>
							<button class="btn btn-ghost btn-sm mt-2" disabled>Angebot erstellen</button>
						</div>
					{:else}
						{#each profile.apartments as apartment (apartment.id)}
							<div
								class="flex justify-between items-center p-4 border border-base-200 rounded-lg bg-base-50/10"
							>
								<div>
									<h4 class="font-bold">{apartment.title}</h4>
									<p class="text-xs opacity-60">{apartment.address}</p>
								</div>
								<a href={resolve(`/apartment/${apartment.id}`)} class="btn btn-ghost btn-sm"
									>Anschauen</a
								>
							</div>
						{/each}
					{/if}
				</div>
			{:else if activeTab === 'requests'}
				<div class="flex flex-col gap-4">
					{#if profile.requests.length === 0}
						<div class="text-center py-8 bg-base-200/30 rounded-lg">
							<p class="text-base-content/50">Du hast noch keine Anfragen gemacht.</p>
							<a href={resolve('/search')} class="btn btn-ghost btn-sm mt-2">Wohnungen suchen</a>
						</div>
					{:else}
						{#each profile.requests as req (req.id)}
							<div
								class="flex justify-between items-center p-4 border border-base-200 rounded-lg bg-base-50/10"
							>
								<div>
									<h4 class="font-bold">{req.apartment.title}</h4>
									<p class="text-xs opacity-60">
										Status:
										<span
											class="badge badge-sm {req.status === 'accepted'
												? 'badge-success'
												: req.status === 'rejected'
													? 'badge-error'
													: 'badge-warning'}"
										>
											{req.status}
										</span>
									</p>
								</div>
								<a href={resolve(`/apartment/${req.apartmentId}`)} class="btn btn-ghost btn-sm"
									>Anschauen</a
								>
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="card bg-base-200/50 border border-base-300">
		<div class="card-body">
			<h3 class="card-title text-sm opacity-70">Account löschen</h3>
			<p class="text-xs opacity-60">
				Wenn du deinen Account löscht, kann er nicht wiederhergestellt werden.
			</p>
			<div class="card-actions justify-start mt-2">
				<button class="btn btn-outline btn-error btn-sm" disabled>Account löschen</button>
			</div>
		</div>
	</div>
</div>
