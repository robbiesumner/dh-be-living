<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
</script>

<div class="flex justify-center items-center py-12">
	<div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border border-base-200">
		<form method="POST" use:enhance class="card-body">
			<h2 class="card-title text-2xl font-bold text-center block mb-4">Willkommen zurück</h2>

			{#if form?.message}
				<div role="alert" class="alert alert-error mb-4 py-2">
					<span class="text-sm">{form.message}</span>
				</div>
			{/if}

			<div class="form-control">
				<label class="label" for="name">
					<span class="label-text font-semibold">Benutzername oder Name</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Max Mustermann"
					class="input input-bordered"
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text font-semibold">Passwort</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="••••••••"
					class="input input-bordered"
					required
				/>
				<p class="label">
					<span class="label-text-alt opacity-60">Jedes Passwort funktioniert zum Testen.</span>
				</p>
			</div>

			<div class="form-control mt-6">
				<button class="btn btn-primary">Einloggen / Registrieren</button>
			</div>
		</form>
	</div>
</div>
