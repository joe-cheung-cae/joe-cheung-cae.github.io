import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { formatReadingTime } from './readingTime.ts';

describe('formatReadingTime locales', () => {
  test('emits English and Chinese reading time for fixed minute counts', () => {
    assert.equal(formatReadingTime(1, 'en'), '1 min read');
    assert.equal(formatReadingTime(5, 'en'), '5 min read');
    assert.equal(formatReadingTime(1, 'zh'), '1 分钟阅读');
    assert.equal(formatReadingTime(5, 'zh'), '5 分钟阅读');
  });
});
