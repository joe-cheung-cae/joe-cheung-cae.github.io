import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { countWords } from './word-count.ts';

describe('countWords', () => {
  test('counts fixture tokens and ignores fenced code', () => {
    const words = ['Alpha', 'beta', 'gamma'];
    const fence = ['```ts', 'const ignored = "do not count these words";', '```'].join('\n');
    const fixture = `${words.join(' ')}\n\n${fence}\n\nplain survivor`;

    assert.equal(countWords(fixture), countWords(fixture));
    assert.equal(countWords(words.join(' ')), words.length);
    assert.equal(countWords(fixture), words.length + 2);
    assert.equal(countWords(`${words.join(' ')}\n\n${fence}`), words.length);
  });

  test('returns zero for empty or whitespace-only markdown', () => {
    assert.equal(countWords(''), 0);
    assert.equal(countWords('   '), 0);
  });
});
