<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
</script>

<div class="max-w-2xl mx-auto py-8">
	<h2 class="text-3xl font-extrabold mb-6">Neues Angebot erstellen</h2>

	<div class="card bg-base-100 border border-base-200 shadow-xl">
		<form method="POST" use:enhance class="card-body gap-4">
			{#if form?.message}
				<div role="alert" class="alert alert-error">
					<span>{form.message}</span>
				</div>
			{/if}

			<div class="form-control">
				<label class="label" for="title">
					<span class="label-text font-semibold">Titel</span>
				</label>
				<input
					type="text"
					id="title"
					name="title"
					placeholder="Gemütliches WG-Zimmer in der Südstadt"
					class="input input-bordered"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="address">
					<span class="label-text font-semibold">Adresse</span>
				</label>
				<input
					type="text"
					id="address"
					name="address"
					placeholder="Kriegsstraße 12, 76131 Karlsruhe"
					class="input input-bordered"
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="size">
						<span class="label-text font-semibold">Größe (m²)</span>
					</label>
					<input
						type="number"
						id="size"
						name="size"
						placeholder="20"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control">
					<label class="label" for="rentPrice">
						<span class="label-text font-semibold">Kaltmiete (€)</span>
					</label>
					<input
						type="number"
						id="rentPrice"
						name="rentPrice"
						placeholder="450"
						class="input input-bordered"
						required
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="form-control">
					<label class="label" for="availableFrom">
						<span class="label-text font-semibold">Verfügbar ab</span>
					</label>
					<input
						type="date"
						id="availableFrom"
						name="availableFrom"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control">
					<label class="label" for="availableTo">
						<span class="label-text font-semibold">Verfügbar bis</span>
					</label>
					<input
						type="date"
						id="availableTo"
						name="availableTo"
						class="input input-bordered"
						required
					/>
				</div>
			</div>

			<div class="form-control mt-2">
				<label class="label cursor-pointer justify-start gap-4">
					<input type="checkbox" id="isWG" name="isWG" class="toggle toggle-primary" checked />
					<span class="label-text font-semibold text-lg">Ist das ein WG-Zimmer?</span>
				</label>
			</div>

			<div class="form-control">
				<label class="label" for="description">
					<span class="label-text font-semibold">Beschreibung</span>
				</label>
				<textarea
					id="description"
					name="description"
					placeholder="Beschreibe die Wohnung, die WG-Kollegen und die Umgebung..."
					class="textarea textarea-bordered h-32"
					required
				></textarea>
			</div>

			<div class="card-actions justify-end mt-4">
				<a href="/" class="btn btn-ghost">Abbrechen</a>
				<button type="submit" class="btn btn-primary">Angebot erstellen</button>
			</div>
		</form>
	</div>
</div>