import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  HOMEPAGE_NOTES_CSS_PROPERTY,
  HOMEPAGE_NOTES_FONT_STACK,
  HOMEPAGE_NOTES_PRIMARY_FAMILY,
  comicCodeFontFaceIsDeclared,
  extractCssVarFontFallback,
  homepageNotesCssTargetsBothLangs,
  homepageNotesFontFaceCss,
  homepageNotesInlineStyle,
  isComicCodePrimary,
  primaryFontFamily,
} from './homepage-notes-font.ts';

const here = dirname(fileURLToPath(import.meta.url));
const homepageCss = readFileSync(join(here, '../styles/homepage.css'), 'utf8');
const homepagePage = readFileSync(join(here, '../pages/index.astro'), 'utf8');

describe('homepage notes font stack', () => {
  test('shipped stack lists Comic Code first for both language surfaces', () => {
    assert.equal(HOMEPAGE_NOTES_PRIMARY_FAMILY, 'Comic Code');
    assert.equal(primaryFontFamily(HOMEPAGE_NOTES_FONT_STACK), 'Comic Code');
    assert.equal(isComicCodePrimary(HOMEPAGE_NOTES_FONT_STACK), true);
    assert.equal(isComicCodePrimary("'IBM Plex Sans', system-ui, sans-serif"), false);
    assert.equal(isComicCodePrimary('"Comic Sans MS", cursive'), false);
    assert.equal(
      primaryFontFamily(homepageNotesInlineStyle().split(':').slice(1).join(':')),
      HOMEPAGE_NOTES_PRIMARY_FAMILY
    );
    assert.equal(comicCodeFontFaceIsDeclared(homepageNotesFontFaceCss()), true);
  });

  test('homepage.css declares Comic Code locally and applies it to en and zh notes', () => {
    assert.equal(comicCodeFontFaceIsDeclared(homepageCss), true);

    const fallback = extractCssVarFontFallback(homepageCss, HOMEPAGE_NOTES_CSS_PROPERTY);
    assert.equal(primaryFontFamily(fallback), HOMEPAGE_NOTES_PRIMARY_FAMILY);
    assert.equal(isComicCodePrimary(fallback), true);
    assert.equal(fallback.replace(/\s+/g, ' '), HOMEPAGE_NOTES_FONT_STACK);

    assert.equal(homepageNotesCssTargetsBothLangs(homepageCss), true);
    assert.match(homepageCss, /#featured-notes|#latest-notes|\.homepage-notes/);
    assert.equal(/font-family:\s*'IBM Plex Sans'/.test(fallback), false);
  });

  test('index.astro wires featured and latest notes to the shipped Comic Code style', () => {
    assert.match(homepagePage, /from '@\/lib\/homepage-notes-font'/);
    assert.match(homepagePage, /homepageNotesFontFaceCss\(\)/);
    assert.match(homepagePage, /homepageNotesInlineStyle\(\)/);
    assert.match(homepagePage, /id="featured-notes"/);
    assert.match(homepagePage, /id="latest-notes"/);
    assert.match(homepagePage, /class="homepage-notes/);
    assert.equal(homepagePage.includes('homepageNotesInlineStyle()'), true);

    const featuredBlock = homepagePage.slice(homepagePage.indexOf('id="featured-notes"'));
    assert.match(featuredBlock, /i18n-en/);
    assert.match(featuredBlock, /i18n-zh/);

    const latestIndex = homepagePage.indexOf('id="latest-notes"');
    assert.notEqual(latestIndex, -1);
    const latestBlock = homepagePage.slice(latestIndex);
    assert.match(latestBlock, /i18n-en/);
    assert.match(latestBlock, /i18n-zh/);
  });
});
