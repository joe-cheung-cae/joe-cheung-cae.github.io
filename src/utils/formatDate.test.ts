import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { formatDate, formatDateISO } from './formatDate.ts';

describe('formatDate locales', () => {
  test('emits English and Chinese long dates for a fixed local calendar day', () => {
    const date = new Date(2024, 1, 15);
    assert.equal(formatDate(date, 'en'), 'February 15, 2024');
    assert.equal(formatDate(date, 'zh'), '2024年2月15日');
    assert.match(formatDateISO(date), /^\d{4}-\d{2}-\d{2}$/);
  });
});
