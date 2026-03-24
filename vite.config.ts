import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			pwaAssets: {
				config: true
			},
			manifest: {
				name: 'DH Be Living',
				short_name: 'DHBL',
				description: 'Wohnungssuche für duale Studenten',
				theme_color: '#e2001a',
				background_color: '#ffffff'
			}
		})
	]
});
