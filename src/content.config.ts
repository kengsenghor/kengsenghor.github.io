import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { workSchema } from './lib/work-schema';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: workSchema,
});

export const collections = { work };
