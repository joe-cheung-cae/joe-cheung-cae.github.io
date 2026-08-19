import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  NOTES_DRAWER_BREAKPOINT_PX,
  NOTES_MENU_OPEN_CLASS,
  isNotesDrawerOverlay,
  isNotesNavActive,
  notesMenuIsOpen,
  nextNotesMenuClassName,
} from './notes-drawer.ts';

describe('notes drawer predicates', () => {
  test('treats viewports below 1300px as overlay', () => {
    assert.equal(NOTES_DRAWER_BREAKPOINT_PX, 1300);
    assert.equal(isNotesDrawerOverlay(390), true);
    assert.equal(isNotesDrawerOverlay(1299), true);
    assert.equal(isNotesDrawerOverlay(1300), false);
    assert.equal(isNotesDrawerOverlay(1440), false);
  });

  test('detects and toggles the is-open class without mutating other tokens', () => {
    assert.equal(NOTES_MENU_OPEN_CLASS, 'is-open');
    assert.equal(notesMenuIsOpen(undefined), false);
    assert.equal(notesMenuIsOpen(''), false);
    assert.equal(notesMenuIsOpen('notes-menu'), false);
    assert.equal(notesMenuIsOpen('notes-menu is-open'), true);

    assert.equal(nextNotesMenuClassName('notes-menu'), 'notes-menu is-open');
    assert.equal(nextNotesMenuClassName('notes-menu is-open'), 'notes-menu');
    assert.equal(nextNotesMenuClassName('notes-menu', true), 'notes-menu is-open');
    assert.equal(nextNotesMenuClassName('notes-menu is-open', false), 'notes-menu');
  });
});

describe('notes nav active state', () => {
  test('matches Home only on the site root', () => {
    assert.equal(isNotesNavActive('/', '/'), true);
    assert.equal(isNotesNavActive('/blog', '/'), false);
    assert.equal(isNotesNavActive('/blog/cmake-modern-targets', '/'), false);
  });

  test('uses prefix match for nested notes routes', () => {
    assert.equal(isNotesNavActive('/blog', '/blog'), true);
    assert.equal(isNotesNavActive('/blog/', '/blog'), true);
    assert.equal(isNotesNavActive('/blog/cmake-modern-targets', '/blog'), true);
    assert.equal(isNotesNavActive('/tags/cpp', '/tags'), true);
    assert.equal(isNotesNavActive('/languages/c++', '/languages'), true);
    assert.equal(isNotesNavActive('/gallery', '/blog'), false);
    assert.equal(isNotesNavActive('/about', '/blog'), false);
  });
});
