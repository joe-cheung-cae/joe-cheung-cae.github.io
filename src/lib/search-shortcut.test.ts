import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isSearchHotkey } from './search-shortcut.ts';

describe('isSearchHotkey', () => {
  test('matches Cmd/Ctrl+K', () => {
    assert.equal(isSearchHotkey({ metaKey: true, ctrlKey: false, key: 'k' }), true);
    assert.equal(isSearchHotkey({ metaKey: false, ctrlKey: true, key: 'K' }), true);
  });

  test('ignores other chords', () => {
    assert.equal(isSearchHotkey({ metaKey: false, ctrlKey: false, key: 'k' }), false);
    assert.equal(isSearchHotkey({ metaKey: true, ctrlKey: false, key: 'f' }), false);
  });
});
