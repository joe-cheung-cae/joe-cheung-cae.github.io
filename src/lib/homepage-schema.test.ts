import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  createHomepageConfig,
  parseHomepageConfig,
  type HomepageIdentity,
} from './homepage-schema.ts';

const joeCheung: HomepageIdentity = {
  author: 'Joe Cheung',
  role: 'CAE & HPC Engineer',
  roleZh: '计算力学与高性能计算工程师',
  email: 'zhangchao.simzc@outlook.com',
  github: 'https://github.com/joe-cheung-cae',
  description:
    'CAE & HPC engineer building GPU particle solvers — SPH, DEM, and rigid-body dynamics.',
};

function validConfig() {
  return {
    head: {
      title: joeCheung.author,
      description: joeCheung.description,
      favicon: '/favicon.svg',
    },
    intro: {
      title: joeCheung.author,
      subtitle: { en: joeCheung.role, zh: joeCheung.roleZh },
      enter: { en: 'enter', zh: '进入' },
      background: true,
    },
    main: {
      name: joeCheung.author,
      signature: { en: joeCheung.role, zh: joeCheung.roleZh },
      links: [
        { href: '/blog', textEn: 'Blog', textZh: '笔记' },
        { href: '/about', textEn: 'About', textZh: '关于' },
        { href: `mailto:${joeCheung.email}`, textEn: 'Email', textZh: '邮箱' },
        { href: joeCheung.github, textEn: 'GitHub', textZh: 'GitHub' },
      ],
    },
  };
}

describe('createHomepageConfig', () => {
  test('binds Joe Cheung identity into head, intro, and main', () => {
    const config = createHomepageConfig(joeCheung);

    assert.equal(config.head.title, 'Joe Cheung');
    assert.equal(config.head.description, joeCheung.description);
    assert.equal(config.head.favicon, '/favicon.svg');
    assert.equal(config.intro.title, 'Joe Cheung');
    assert.equal(config.intro.subtitle.en, joeCheung.role);
    assert.equal(config.intro.subtitle.zh, joeCheung.roleZh);
    assert.equal(config.intro.enter.en, 'enter');
    assert.equal(config.intro.enter.zh, '进入');
    assert.equal(config.intro.background, true);
    assert.equal(config.main.name, 'Joe Cheung');
    assert.equal(config.main.signature.en, joeCheung.role);
    assert.equal(config.main.signature.zh, joeCheung.roleZh);
    assert.equal('avatar' in config.main, false);
    assert.equal('supportAuthor' in config, false);
    assert.equal('supportAuthor' in config.intro, false);
    assert.deepEqual(
      config.main.links.map((link) => link.href),
      ['/blog', '/about', `mailto:${joeCheung.email}`, joeCheung.github]
    );
  });
});

describe('parseHomepageConfig', () => {
  test('defaults intro.background to true when omitted', () => {
    const source = validConfig();
    const parsed = parseHomepageConfig({
      ...source,
      intro: {
        title: source.intro.title,
        subtitle: source.intro.subtitle,
        enter: source.intro.enter,
      },
    });
    assert.equal(parsed.intro.background, true);
  });

  test('rejects Simon supportAuthor and extra keys', () => {
    assert.throws(
      () =>
        parseHomepageConfig({
          ...validConfig(),
          supportAuthor: true,
        }),
      /Invalid homepage config/
    );
    assert.throws(
      () =>
        parseHomepageConfig({
          ...validConfig(),
          intro: {
            ...validConfig().intro,
            supportAuthor: true,
          },
        }),
      /Invalid homepage config/
    );
  });

  test('rejects main links that omit blog, about, mailto, or github', () => {
    assert.throws(
      () =>
        parseHomepageConfig({
          ...validConfig(),
          main: {
            ...validConfig().main,
            links: [
              { href: '/projects', textEn: 'Projects', textZh: '项目' },
              { href: '/about', textEn: 'About', textZh: '关于' },
              { href: `mailto:${joeCheung.email}`, textEn: 'Email', textZh: '邮箱' },
              { href: joeCheung.github, textEn: 'GitHub', textZh: 'GitHub' },
            ],
          },
        }),
      /main.links must include \/blog/
    );
  });
});
