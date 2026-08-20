import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const postsDir = join(dirname(fileURLToPath(import.meta.url)), '../content/posts');

function frontmatter(source: string): string {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'post must have YAML frontmatter');
  return match[1] ?? '';
}

function scalar(fm: string, key: string): string {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  assert.ok(match, `missing ${key}`);
  return (match[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
}

describe('post bilingual metadata', () => {
  test('every post declares titleZh and descriptionZh without rewriting the body', () => {
    const files = readdirSync(postsDir).filter((name) => name.endsWith('.mdx'));
    assert.equal(files.length, 6);

    for (const file of files) {
      const source = readFileSync(join(postsDir, file), 'utf8');
      const fm = frontmatter(source);
      const title = scalar(fm, 'title');
      const titleZh = scalar(fm, 'titleZh');
      const description = scalar(fm, 'description');
      const descriptionZh = scalar(fm, 'descriptionZh');

      assert.ok(title.length > 0, `${file} title`);
      assert.ok(titleZh.length > 0, `${file} titleZh`);
      assert.ok(description.length > 0, `${file} description`);
      assert.ok(descriptionZh.length > 0, `${file} descriptionZh`);
      assert.notEqual(titleZh, title, `${file} titleZh must not copy the English title`);
      assert.notEqual(descriptionZh, description, `${file} descriptionZh must not copy English`);
      assert.match(titleZh, /[\u3400-\u9fff]/, `${file} titleZh must include Chinese`);
      assert.match(descriptionZh, /[\u3400-\u9fff]/, `${file} descriptionZh must include Chinese`);
    }
  });
});
