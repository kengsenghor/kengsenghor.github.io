import { z } from 'astro/zod';

export const workSchema = z.object({
  title: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(20),
  tags: z.array(z.string().min(1)).min(1),
  widget: z.enum(['forecast']).optional(),
});
