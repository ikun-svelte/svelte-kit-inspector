import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteKitInspector } from 'svelte-kit-inspector'
export default defineConfig({
	plugins: [
		svelteKitInspector(),
		sveltekit(),
	]
});
