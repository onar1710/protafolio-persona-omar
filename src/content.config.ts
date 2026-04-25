import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: () =>
		z
			.object({
			title: z.string(),
			description: z.string(),
			author: z.string().default('Omar Fuentes'),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),
			heroImageUrl: z.string().optional(),
		})
			.transform((data) => ({
				...data,
				heroImage: data.heroImage ?? data.heroImageUrl,
			})),
});

export const collections = { blog };
