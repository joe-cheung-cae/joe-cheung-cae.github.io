export const siteConfig = {
  title: 'Tech Notes',
  description: 'A notion-like blog for technical notes on algorithms, C++, CMake, CUDA, and more.',
  author: 'Tech Notes Author',
  email: 'author@example.com',
  siteUrl: 'https://chaoboli.github.io/notion-like-tech-notes',
  social: {
    github: 'https://github.com/chaoboli',
    twitter: 'https://twitter.com/username',
    linkedin: 'https://linkedin.com/in/username',
  },
  pagination: {
    postsPerPage: 10,
  },
  search: {
    maxResults: 10,
    minQueryLength: 2,
  },
} as const;

export type SiteConfig = typeof siteConfig;
