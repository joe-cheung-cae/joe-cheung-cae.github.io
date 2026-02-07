# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-02-07

### Added
- Multi-backend deployment support
  - Local deployment with `npm run build:local`
  - GitHub Pages deployment with `npm run build:github`
  - Docker deployment with `npm run deploy:docker`
- Environment-based configuration system (.env.local, .env.github, .env.docker)
- Docker and docker-compose configuration files
- nginx configuration for optimized static file serving
- Deployment-specific build scripts in package.json
- Comprehensive deployment documentation (DEPLOYMENT.md)

### Changed
- `astro.config.mjs` now uses environment variables for site/base URLs
- `site.config.ts` now dynamically determines siteUrl from deployment environment
- Updated GitHub remote to `git@github.com:joe-cheung-cae/joe-cheung-cae.github.io.git`
- Changed `DEPLOY_BASE` from `/joe-blog` to `/` for user site deployment
- Switched to "deploy from a branch" method for GitHub Pages (using `gh-pages` tool)
- Removed GitHub Actions workflow in favor of branch-based deployment

## [1.0.0] - 2024-02-06

### Added
- Initial release of notion-like tech notes blog
- Astro 5.x with TypeScript support
- Dark/light theme toggle with system preference detection
- Client-side search with MiniSearch (Cmd+K shortcut)
- MDX support for rich content with interactive components
- 6 technical blog posts covering C++, CMake, CUDA, and algorithms
- Tag-based and language-based navigation
- RSS feed generation
- Sitemap generation for SEO
- Responsive design with Tailwind CSS
- GitHub Actions deployment workflow
- Callout components for notes, tips, warnings
- Syntax highlighting with Shiki
- Table of contents for posts
- Previous/next post navigation
- Related posts suggestions

### Technical
- Static site generation with Astro
- Preact islands for interactive components
- Content collections with Zod schema validation
- Custom reading time calculation
- Automatic draft filtering for production builds
- OpenGraph meta tags for social sharing

[Unreleased]: https://github.com/chaoboli/notion-like-tech-notes/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/chaoboli/notion-like-tech-notes/releases/tag/v1.0.0
