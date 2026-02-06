import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(500),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    language: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};

export type Post = z.infer<typeof postsCollection.schema>;
