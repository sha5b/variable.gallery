import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
        rollupOptions: {
            external: ['stripe']
        }
    },
    ssr: {
        noExternal: ['@stripe/stripe-js']
    },
	server: {
		fs: {
			allow: [
				// search up for workspace root
				searchForWorkspaceRoot(process.cwd()),
				// your custom rules
				'/.well-known/',
			],
		},
	},
});
