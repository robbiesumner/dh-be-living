<script lang="ts">
	import './layout.css';

	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/dhbl-logo-192.png" /></svelte:head>
<div class="mx-auto max-w-2xl p-4">
	<div class="navbar mb-8 border-b-4 border-primary pb-4">
		<h1 class="navbar-start">
			<a
				href={resolve('/')}
				class="text-2xl font-extrabold text-base-content decoration-transparent transition-opacity hover:opacity-80"
			>
				DH<span class="text-primary"> Be Living</span>
			</a>
		</h1>
		<div class="navbar-end gap-3">
			<a href={resolve('/profile')} class="btn avatar btn-circle border border-base-300 btn-ghost">
				<div class="w-10 rounded-full">
					<img
						class="text-transparent"
						alt="User Avatar"
						src="https://loremflickr.com/100/100/face?lock=4"
					/>
				</div>
			</a>
		</div>
	</div>

	{@render children()}
</div>
