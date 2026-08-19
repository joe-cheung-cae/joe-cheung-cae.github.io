import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { coverStops, hashString } from './note-cover.ts';

const fixtureSlug = 'cmake-modern-targets';

describe('hashString', () => {
  test('calls the shipped hasher twice for a fixture slug and stays stable', () => {
    const first = hashString(fixtureSlug);
    const second = hashString(fixtureSlug);

    assert.equal(typeof first, 'number');
    assert.equal(Number.isInteger(first), true);
    assert.equal(first, second);
  });

  test('different slugs hash differently without reimplementing the hasher', () => {
    assert.notEqual(hashString(fixtureSlug), hashString('cuda-kernel-basics'));
  });
});

describe('coverStops', () => {
  test('returns deterministic CSS colors by calling the shipped function twice', () => {
    const first = coverStops(fixtureSlug);
    const second = coverStops(fixtureSlug);

    assert.deepEqual(first, second);
    assert.match(first.start, /^(#|hsl|rgb)/i);
    assert.match(first.mid, /^(#|hsl|rgb)/i);
    assert.match(first.end, /^(#|hsl|rgb)/i);
    assert.notDeepEqual(coverStops(fixtureSlug), coverStops('cuda-kernel-basics'));
  });
});
