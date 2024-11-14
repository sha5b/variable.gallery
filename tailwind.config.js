import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)',
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
			},
			fontFamily: {
				heading: 'var(--font-heading)',
				body: 'var(--font-body)',
			},
			spacing: {
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
			},
			borderRadius: {
				sm: 'var(--border-radius-sm)',
				md: 'var(--border-radius-md)',
				lg: 'var(--border-radius-lg)',
				full: 'var(--border-radius-full)',
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
};
