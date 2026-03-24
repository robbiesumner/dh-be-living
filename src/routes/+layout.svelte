<script lang="ts">
	import './layout.css';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	import { pwaInfo } from 'virtual:pwa-info';

	let { data, children } = $props();
	const user = $derived(data.user);

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifestLink}
</svelte:head>

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
			{#if user}
				<a
					href={resolve('/profile')}
					class="btn avatar btn-circle border border-base-300 btn-ghost"
					title={user.name}
				>
					<div class="w-10 rounded-full">
						<img
							class="text-transparent"
							alt="User Avatar"
							src="https://loremflickr.com/100/100/face?lock={user.id}"
						/>
					</div>
				</a>
			{:else}
				<a href={resolve('/login')} class="btn btn-ghost">Login</a>
			{/if}
		</div>
	</div>

	{@render children()}
</div>
