// @ts-check

import mdx from '@astrojs/mdx';
import autoprefixer from 'autoprefixer';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from 'tailwindcss';

// https://astro.build/config
export default defineConfig({
	site: 'https://omarfuentes.com',
	trailingSlash: 'ignore',
	integrations: [mdx()],
	vite: {
		css: {
			postcss: {
				plugins: [tailwindcss, autoprefixer],
			},
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
