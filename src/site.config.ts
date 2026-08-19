import { getSiteUrl, getSiteOrigin } from './utils/deployment';
import type { HomepageConfig } from './lib/homepage-schema';

export const siteIdentity = {
  author: 'Joe Cheung',
  role: 'CAE & HPC Engineer',
  roleZh: '计算力学与高性能计算工程师',
  email: 'zhangchao.simzc@outlook.com',
  github: 'https://github.com/joe-cheung-cae',
  description:
    'CAE & HPC engineer building GPU particle solvers — SPH, DEM, and rigid-body dynamics.',
  descriptionZh: '计算力学 / 高性能计算工程师，做 GPU 粒子求解器：SPH、DEM、刚体动力学。',
} as const;

export type SiteIdentity = typeof siteIdentity;

export const siteConfig = {
  title: siteIdentity.author,
  shortName: 'JC',
  description: siteIdentity.description,
  descriptionZh: siteIdentity.descriptionZh,
  author: siteIdentity.author,
  role: siteIdentity.role,
  roleZh: siteIdentity.roleZh,
  email: siteIdentity.email,
  get siteUrl() {
    return getSiteUrl();
  },
  get siteOrigin() {
    return getSiteOrigin();
  },
  social: {
    github: siteIdentity.github,
    x: 'https://x.com/JoeCheungZzz',
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
export type { HomepageConfig };
