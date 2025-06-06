import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
				manualChunks: undefined
			}
		}
	},
	css: {
		// This will inline all CSS
		extract: false
	}
});
