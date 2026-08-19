import { siteConfig, siteIdentity } from './site.config';
import {
  createHomepageConfig,
  type HomepageConfig,
} from './lib/homepage-schema';

export const homepageConfig: HomepageConfig = createHomepageConfig({
  author: siteIdentity.author,
  role: siteConfig.role,
  roleZh: siteConfig.roleZh,
  email: siteConfig.email,
  github: siteConfig.social.github,
  description: siteConfig.description,
});

export type {
  BilingualText,
  HomepageConfig,
  HomepageIdentity,
  HomepageLink,
} from './lib/homepage-schema';
export {
  createHomepageConfig,
  homepageConfigSchema,
  parseHomepageConfig,
} from './lib/homepage-schema';
