import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { tt } from 'svelte-kit-inspector'
tt()
export default defineConfig({
	plugins: [sveltekit()]
});
