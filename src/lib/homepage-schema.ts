import { z } from 'zod';

export const bilingualTextSchema = z
  .object({
    en: z.string().min(1),
    zh: z.string().min(1),
  })
  .strict();

export const homepageLinkSchema = z
  .object({
    href: z.string().min(1),
    textEn: z.string().min(1),
    textZh: z.string().min(1),
  })
  .strict();

export const homepageConfigSchema = z
  .object({
    head: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        favicon: z.string().min(1).default('/favicon.svg'),
      })
      .strict(),
    intro: z
      .object({
        title: z.string().min(1),
        subtitle: bilingualTextSchema,
        enter: bilingualTextSchema,
        background: z.boolean().default(true),
      })
      .strict(),
    main: z
      .object({
        name: z.string().min(1),
        signature: bilingualTextSchema,
        avatar: z.string().min(1).optional(),
        links: z.array(homepageLinkSchema).min(4),
      })
      .strict(),
  })
  .strict()
  .superRefine((config, ctx) => {
    const hrefs = config.main.links.map((link) => link.href);
    const required = [
      { ok: hrefs.includes('/blog'), message: 'main.links must include /blog' },
      { ok: hrefs.includes('/about'), message: 'main.links must include /about' },
      { ok: hrefs.some((href) => href.startsWith('mailto:')), message: 'main.links must include mailto' },
      { ok: hrefs.some((href) => href.includes('github')), message: 'main.links must include github' },
    ];

    for (const rule of required) {
      if (!rule.ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['main', 'links'],
          message: rule.message,
        });
      }
    }
  });

export type BilingualText = z.infer<typeof bilingualTextSchema>;
export type HomepageLink = z.infer<typeof homepageLinkSchema>;
export type HomepageConfig = z.infer<typeof homepageConfigSchema>;

export type HomepageIdentity = {
  author: string;
  role: string;
  roleZh: string;
  email: string;
  github: string;
  description: string;
};

export function parseHomepageConfig(input: unknown): HomepageConfig {
  const result = homepageConfigSchema.safeParse(input);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid homepage config: ${detail}`);
  }
  return result.data;
}

export function createHomepageConfig(identity: HomepageIdentity): HomepageConfig {
  return parseHomepageConfig({
    head: {
      title: identity.author,
      description: identity.description,
      favicon: '/favicon.svg',
    },
    intro: {
      title: identity.author,
      subtitle: {
        en: identity.role,
        zh: identity.roleZh,
      },
      enter: {
        en: 'enter',
        zh: '进入',
      },
      background: true,
    },
    main: {
      name: identity.author,
      signature: {
        en: identity.role,
        zh: identity.roleZh,
      },
      links: [
        { href: '/blog', textEn: 'Blog', textZh: '笔记' },
        { href: '/about', textEn: 'About', textZh: '关于' },
        { href: `mailto:${identity.email}`, textEn: 'Email', textZh: '邮箱' },
        { href: identity.github, textEn: 'GitHub', textZh: 'GitHub' },
      ],
    },
  });
}
