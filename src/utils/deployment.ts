/**
 * Deployment utilities for environment-aware configuration
 */

export type DeploymentTarget = 'local' | 'github' | 'docker';

/**
 * Get the current deployment target based on environment variables
 */
export function getDeploymentTarget(): DeploymentTarget {
  const site = process.env.DEPLOY_SITE || '';
  const base = process.env.DEPLOY_BASE || '';

  if (site.includes('github.io')) {
    return 'github';
  }

  if (site.includes('8080') || base === '/') {
    // Docker typically uses port 8080 or root base
    return 'docker';
  }

  return 'local';
}

/**
 * Get the site origin (domain only, without base path)
 * This returns DEPLOY_SITE without any base path
 */
export function getSiteOrigin(): string {
  const site = process.env.DEPLOY_SITE || 'http://localhost:4321';
  // Remove trailing slash
  return site.replace(/\/$/, '');
}

/**
 * Get the full site URL for the current deployment
 * Combines DEPLOY_SITE and DEPLOY_BASE
 */
export function getSiteUrl(): string {
  const site = process.env.DEPLOY_SITE || 'http://localhost:4321';
  const base = process.env.DEPLOY_BASE || '/';

  // Remove trailing slash from site and ensure base starts with /
  const cleanSite = site.replace(/\/$/, '');
  const cleanBase = base.startsWith('/') ? base : `/${base}`;

  // Remove trailing slash from base unless it's just /
  const finalBase = cleanBase === '/' ? '' : cleanBase.replace(/\/$/, '');

  return `${cleanSite}${finalBase}`;
}

/**
 * Get the base URL path for the current deployment
 */
export function getBaseUrl(): string {
  return process.env.DEPLOY_BASE || '/';
}

/**
 * Check if running in production build mode
 */
export function isBuild(): boolean {
  return process.argv.includes('build');
}
