# Deployment Guide

This guide covers all available deployment options for the Tech Notes blog.

## Table of Contents

- [Overview](#overview)
- [Local Development](#local-development)
- [GitHub Pages](#github-pages)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

This blog supports three deployment backends:

| Backend | Use Case | Default URL |
|---------|----------|-------------|
| **Local** | Development and testing | `http://localhost:4321` |
| **GitHub Pages** | Free static hosting | `https://<username>.github.io` |
| **Docker** | Self-hosted/containerized | `http://localhost:8080` |

Each backend uses environment-specific configuration to ensure correct URLs, paths, and asset loading.

## Local Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`.

### Local Build

```bash
# Build for local deployment
npm run build:local

# Preview the build locally
npm run preview
```

### Configuration

Local deployment uses `.env.local`:

```
DEPLOY_SITE=http://localhost:4321
DEPLOY_BASE=/
```

## GitHub Pages (Deploy from Branch)

GitHub Pages deployment uses the "deploy from a branch" method. The `dist/` folder is pushed to the `gh-pages` branch, which GitHub Pages then serves.

### Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Enable GitHub Pages** (one-time setup):
   - Go to repository **Settings** → **Pages**
   - Under "Build and deployment", select **Deploy from a branch**
   - Select branch: `gh-pages` / folder: `/ (root)`
   - Save changes

3. **Deploy**:
   ```bash
   npm run deploy:github
   ```

### Configuration

Edit `.env.github` based on your repository type:

**User Site** (`username.github.io` repository):
```bash
# .env.github
DEPLOY_SITE=https://<your-username>.github.io
DEPLOY_BASE=/
```

**Project Site** (any other repository):
```bash
# .env.github
DEPLOY_SITE=https://<your-username>.github.io
DEPLOY_BASE=/<your-repo-name>
```

**Note**: Since this project uses `joe-cheung-cae.github.io` (user site), `DEPLOY_BASE` is set to `/`.

### How It Works

The `npm run deploy:github` command:
1. Runs `npm run build:github` to create a production build in `dist/`
2. Uses `gh-pages` tool to push the `dist/` folder to the `gh-pages` branch
3. GitHub Pages serves the content from that branch

### Manual Build (for testing)

```bash
# Build locally to verify
npm run build:github

# Preview (note: some paths may not work in preview)
npm run preview
```

### Deploy Script

The deploy script is defined in `package.json`:
```json
"deploy:github": "npm run build:github && gh-pages -d dist"
```

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed (optional, for docker-compose method)

### Quick Start with Docker Compose

```bash
# Build and run
npm run deploy:docker

# Or directly
docker-compose up --build
```

The site will be available at `http://localhost:8080`.

### Docker Commands

```bash
# Build Docker image
docker build -t joe-blog .

# Run container
docker run -d -p 8080:80 --name joe-blog joe-blog

# Stop container
docker stop joe-blog

# Remove container
docker rm joe-blog
```

### Preview Build

```bash
# Build for Docker and run preview
npm run build:docker
npm run preview:docker
```

### Configuration

Docker uses `.env.docker`:

```
DEPLOY_SITE=http://localhost:8080
DEPLOY_BASE=/
```

The Docker image uses nginx to serve static files with:
- Gzip compression enabled
- SPA routing support (fallback to index.html)
- Security headers
- Static asset caching (1 year)

### Customization

To change the port:

```bash
# docker-compose.yml
ports:
  - "3000:80"  # Change 3000 to your preferred port
```

Or with docker run:

```bash
docker run -p 3000:80 joe-blog
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DEPLOY_SITE` | Full site URL without trailing slash | `https://example.com` |
| `DEPLOY_BASE` | Base path (use `/` for root) | `/blog` |

### Per-Environment Files

| File | Usage |
|------|-------|
| `.env.local` | Local development |
| `.env.github` | GitHub Pages production |
| `.env.docker` | Docker container deployment |
| `.env` | Active environment (copied by build scripts) |

## Troubleshooting

### Build Errors

**Error: Cannot find module 'dotenv'**
```bash
npm install
```

**Error: DEPLOY_SITE is not defined**
Ensure `.env` file exists (build scripts copy the appropriate environment file).

### URL Issues

**Links not working after deployment**
- Check that `DEPLOY_BASE` matches your deployment path
- For GitHub Pages, must include repository name (e.g., `/joe-blog`)
- For local/Docker, use `/` for root path

**OG images not showing**
- Verify `DEPLOY_SITE` includes the full URL with protocol
- Check that the site URL is publicly accessible

### Docker Issues

**Port already in use**
```bash
# Find process using port 8080
lsof -i :8080

# Use different port
docker run -p 3000:80 joe-blog
```

**Container won't start**
```bash
# Check logs
docker logs joe-blog

# Rebuild from scratch
docker-compose down
docker-compose up --build
```

### GitHub Pages Issues

**404 errors after deployment**
- For **user sites** (`username.github.io` repo): Use `DEPLOY_BASE=/`
- For **project sites**: Use `DEPLOY_BASE=/<repo-name>`
- Check that GitHub Pages source is set to "Deploy from a branch"
- Verify `gh-pages` branch exists and has content
- Wait 1-2 minutes for GitHub Pages to propagate changes

**gh-pages branch not found**
- Run `npm run deploy:github` to create the branch
- Or manually create via: `git checkout --orphan gh-pages`

**Deploy fails with authentication error**
- Ensure you have push access to the repository
- Run `gh-pages` with authentication: `npx gh-pages -d dist -r git@github.com:username/repo.git`

**CSS/JS not loading**
- Check browser console for 404 errors
- Verify `base` in `astro.config.mjs` matches `DEPLOY_BASE`
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

## Advanced Configuration

### Custom Domain (GitHub Pages)

1. Add `CNAME` file with your domain to `public/` directory
2. Update `.env.github`:
   ```
   DEPLOY_SITE=https://yourdomain.com
   DEPLOY_BASE=/
   ```
3. Configure DNS with your provider
4. Enable custom domain in repository Settings → Pages

### HTTPS in Docker

For production Docker deployments, use a reverse proxy (nginx-proxy, Traefik) or cloud load balancer to handle SSL termination.

## Migration Guide

### Switching from GitHub Pages to Docker

1. Update environment variables in `.env.docker`
2. Build and deploy:
   ```bash
   npm run deploy:docker
   ```
3. Update DNS to point to your Docker host

### Switching from Docker to GitHub Pages

1. Ensure `.env.github` has correct values
2. Enable GitHub Actions in repository settings
3. Push to main branch
4. Update DNS or redirect as needed
