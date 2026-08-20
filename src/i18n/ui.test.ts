import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  IDENTICAL_UI_KEYS,
  LANG_CHANGE_EVENT,
  applyDocumentLang,
  formatMoreTags,
  formatNoResults,
  formatNotesCount,
  formatPostsCount,
  formatResults,
  formatTopics,
  formatWords,
  readDocumentLang,
  t,
  ui,
  type UiKey,
} from './ui.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '../..');

function keysOf(record: Record<string, string>): string[] {
  return Object.keys(record).sort();
}

function hasCjk(value: string): boolean {
  return /[\u3400-\u9fff]/.test(value);
}

describe('ui dictionary', () => {
  test('en and zh expose the same keys', () => {
    assert.deepEqual(keysOf(ui.en), keysOf(ui.zh));
  });

  test('required Chinese UI copy is non-empty and not English except kept tokens', () => {
    const keys = Object.keys(ui.en) as UiKey[];
    assert.ok(keys.length >= 30, 'dictionary must cover chrome, search, cards, and status text');

    for (const key of keys) {
      const en = ui.en[key];
      const zh = ui.zh[key];
      assert.equal(typeof en, 'string');
      assert.equal(typeof zh, 'string');
      assert.ok(en.trim().length > 0, `${key} en must be non-empty`);
      assert.ok(zh.trim().length > 0, `${key} zh must be non-empty`);

      if ((IDENTICAL_UI_KEYS as readonly string[]).includes(key)) {
        assert.equal(zh, en, `${key} must stay identical`);
        continue;
      }

      assert.notEqual(zh, en, `${key} zh must differ from en`);
      assert.equal(hasCjk(zh), true, `${key} zh must include Chinese characters: ${zh}`);
    }

    assert.equal(t('zh', 'openSearch'), '打开搜索');
    assert.equal(t('zh', 'searchPlaceholder'), '搜索笔记、标签或语言…');
    assert.equal(t('zh', 'quickPreview'), '快速预览');
    assert.equal(t('zh', 'featured'), '精选');
    assert.equal(t('zh', 'readNote'), '阅读笔记');
    assert.equal(t('zh', 'startHere'), '从这里开始');
    assert.equal(t('zh', 'pageNotFound'), '页面未找到');
    assert.equal(t('zh', 'toggleMenu'), '切换菜单');
    assert.equal(t('zh', 'switchToDark'), '切换到深色模式');
    assert.equal(t('zh', 'copyCode'), '复制代码');
    assert.equal(t('zh', 'email'), '邮箱');
    assert.equal(t('en', 'github'), 'GitHub');
    assert.equal(t('zh', 'github'), 'GitHub');
  });

  test('about contact list uses the email dictionary instead of a hardcoded Email: label', () => {
    const about = readFileSync(join(repoRoot, 'src/pages/about.astro'), 'utf8');
    assert.match(about, /ui\.en\.email/);
    assert.match(about, /ui\.zh\.email/);
    assert.match(about, /class="i18n-en">\{ui\.en\.email\}/);
    assert.match(about, /class="i18n-zh">\{ui\.zh\.email\}/);
    assert.equal(/Email:\s*<a href=\{`mailto:/.test(about), false);
  });

  test('count and search helpers emit Chinese and English', () => {
    assert.equal(formatTopics('en', 1), '1 topic');
    assert.equal(formatTopics('en', 4), '4 topics');
    assert.equal(formatTopics('zh', 1), '1 个主题');
    assert.equal(formatTopics('zh', 4), '4 个主题');

    assert.equal(formatMoreTags('en', 2), '+2 more');
    assert.equal(formatMoreTags('zh', 2), '+2 更多');

    assert.equal(formatResults('en', 1), '1 result');
    assert.equal(formatResults('en', 3), '3 results');
    assert.equal(formatResults('zh', 1), '1 条结果');
    assert.equal(formatResults('zh', 3), '3 条结果');

    assert.equal(formatNoResults('en', 'cpp'), 'No results found for "cpp"');
    assert.equal(formatNoResults('zh', 'cpp'), '未找到 “cpp” 的结果');

    assert.equal(formatWords('en', 1200), '1,200 words');
    assert.equal(formatWords('zh', 1200), '1,200 词');

    assert.equal(formatPostsCount('en', 1), '1 post');
    assert.equal(formatPostsCount('en', 2), '2 posts');
    assert.equal(formatPostsCount('zh', 2), '2 篇笔记');
    assert.equal(formatNotesCount('en', 1), '1 note');
    assert.equal(formatNotesCount('zh', 3), '3 篇笔记');
  });

  test('document lang helpers map data-lang without reading localStorage', () => {
    const attrs = new Map<string, string>([
      ['data-lang', 'en'],
      ['lang', 'en'],
    ]);
    const el = {
      getAttribute: (name: string) => attrs.get(name) ?? null,
      setAttribute: (name: string, value: string) => {
        attrs.set(name, value);
      },
    };

    assert.equal(readDocumentLang(el), 'en');
    applyDocumentLang(el, 'zh');
    assert.equal(el.getAttribute('data-lang'), 'zh');
    assert.equal(el.getAttribute('lang'), 'zh-Hans');
    assert.equal(readDocumentLang(el), 'zh');
    assert.equal(LANG_CHANGE_EVENT, 'lang-change');
  });

  test('LangToggle dispatches lang-change and SearchModal listens; no SSR localStorage', () => {
    const langToggle = readFileSync(join(repoRoot, 'src/components/LangToggle.tsx'), 'utf8');
    const searchModal = readFileSync(join(repoRoot, 'src/components/search/SearchModal.tsx'), 'utf8');
    const themeToggle = readFileSync(join(repoRoot, 'src/components/ThemeToggle.tsx'), 'utf8');

    assert.match(langToggle, /LANG_CHANGE_EVENT|lang-change/);
    assert.match(langToggle, /dispatchEvent/);
    assert.match(searchModal, /LANG_CHANGE_EVENT|lang-change/);
    assert.match(searchModal, /addEventListener/);
    assert.match(themeToggle, /LANG_CHANGE_EVENT|lang-change/);

    assert.equal(langToggle.includes('localStorage') && langToggle.includes('useEffect'), true);
    assert.equal(/^[^{]*localStorage/s.test(langToggle.replace(/^import[\s\S]*?;\n/g, '')), false);

    const astroFiles = [
      'src/layouts/BaseLayout.astro',
      'src/layouts/PostLayout.astro',
      'src/layouts/NotesLayout.astro',
      'src/pages/index.astro',
      'src/components/ui/Card.astro',
      'src/components/notes/NoteCard.astro',
    ];
    for (const relative of astroFiles) {
      const source = readFileSync(join(repoRoot, relative), 'utf8');
      const frontmatter = source.match(/^---\n[\s\S]*?\n---/)?.[0] ?? '';
      assert.equal(
        frontmatter.includes('localStorage'),
        false,
        `${relative} frontmatter must not read localStorage`
      );
    }
  });
});
