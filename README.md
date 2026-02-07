# Tech Notes

A notion-like technical blog built with Astro, featuring fast search, dark mode, and MDX content.

## Features

- **Fast Search**: Client-side search with MiniSearch (Cmd+K)
- **Dark Mode**: Automatic theme switching with system preference detection
- **MDX Support**: Rich content with interactive components
- **Tag-based Navigation**: Browse by tags or programming language
- **Responsive Design**: Mobile-first, works on all devices
- **SEO Optimized**: Meta tags, OpenGraph, RSS feed, sitemap
- **TypeScript**: Full type safety throughout

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [MDX](https://mdxjs.com) - Markdown with components
- [Preact](https://preactjs.com) - Interactive islands
- [MiniSearch](https://github.com/lucaong/minisearch) - Client-side search

## Project Structure

```
├── src/
│   ├── components/          # UI components
│   │   ├── navigation/      # Header, Footer, TOC
│   │   ├── search/          # Search modal
│   │   └── ui/              # Cards, tags, callouts
│   ├── content/
│   │   └── posts/           # MDX blog posts
│   ├── layouts/             # Page layouts
│   ├── pages/               # Route definitions
│   ├── styles/              # Global CSS
│   └── utils/               # Helper functions
└── public/                  # Static assets
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Content

Create a new `.mdx` file in `src/content/posts/`:

```mdx
---
title: 'Your Post Title'
description: 'Brief description'
pubDate: 2024-01-15
tags: ['tag1', 'tag2']
language: 'C++'
featured: true
---

import Callout from '@/components/ui/Callout.astro';

Your content here...

<Callout type="tip">
  Use callouts for important notes!
</Callout>
```

## Deployment

| Backend | Method | Command |
|---------|--------|---------|
| **Local** | Development server | `npm run dev` |
| **GitHub Pages** | Deploy from branch | `npm run deploy:github` |
| **Docker** | Self-hosted container | `npm run deploy:docker` |

### GitHub Pages

Deploy to GitHub Pages using "deploy from a branch":

```bash
npm run deploy:github
```

This builds the site and pushes the `dist/` folder to the `gh-pages` branch.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## License

MIT
