import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  HOMEPAGE_NOTES_CSS_PROPERTY,
  HOMEPAGE_NOTES_FONT_RELEASE,
  HOMEPAGE_NOTES_FONT_STACK,
  HOMEPAGE_NOTES_PRIMARY_FAMILY,
  HOMEPAGE_NOTES_WOFF2_FILE,
  HOMEPAGE_NOTES_WOFF2_PATH,
  cssAppliesMapleMonoToCodeSnippets,
  cssEnablesMapleMonoLigatures,
  cssUsesComicCodeLocal,
  extractCssVarFontFallback,
  homepageNotesCssTargetsBothLangs,
  homepageNotesFontFaceCss,
  homepageNotesInlineStyle,
  homepageNotesLigatureFeatureSettings,
  isHomepageNotesPrimary,
  mapleMonoCodeSnippetCss,
  mapleMonoNfCnFontFaceIsDeclared,
  primaryFontFamily,
} from './homepage-notes-font.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '../..');
const homepageCss = readFileSync(join(here, '../styles/homepage.css'), 'utf8');
const homepagePage = readFileSync(join(here, '../pages/index.astro'), 'utf8');
const woff2Path = join(repoRoot, 'public/fonts', HOMEPAGE_NOTES_WOFF2_FILE);
const oflPath = join(repoRoot, 'public/fonts/OFL.txt');

describe('homepage notes font stack', () => {
  test('shipped stack lists Maple Mono NF CN first for both language surfaces', () => {
    assert.equal(HOMEPAGE_NOTES_PRIMARY_FAMILY, 'Maple Mono NF CN');
    assert.equal(primaryFontFamily(HOMEPAGE_NOTES_FONT_STACK), 'Maple Mono NF CN');
    assert.equal(isHomepageNotesPrimary(HOMEPAGE_NOTES_FONT_STACK), true);
    assert.equal(isHomepageNotesPrimary("'IBM Plex Sans', system-ui, sans-serif"), false);
    assert.equal(isHomepageNotesPrimary("'Comic Code', ui-monospace, monospace"), false);
    assert.equal(
      primaryFontFamily(homepageNotesInlineStyle().split(':').slice(1).join(':')),
      HOMEPAGE_NOTES_PRIMARY_FAMILY
    );
    assert.equal(mapleMonoNfCnFontFaceIsDeclared(homepageNotesFontFaceCss()), true);
    assert.equal(cssUsesComicCodeLocal(homepageNotesFontFaceCss()), false);
    assert.match(homepageNotesFontFaceCss(), /font-display:\s*swap/);
    assert.match(homepageNotesFontFaceCss(), new RegExp(HOMEPAGE_NOTES_WOFF2_PATH.replace('/', '\\/')));
    assert.equal(HOMEPAGE_NOTES_FONT_RELEASE.zip, 'MapleMono-NF-CN.zip');
    assert.equal(HOMEPAGE_NOTES_FONT_RELEASE.license, 'OFL-1.1');
  });

  test('homepage.css declares Maple Mono NF CN via WOFF2 and applies it to en and zh notes', () => {
    assert.equal(mapleMonoNfCnFontFaceIsDeclared(homepageCss), true);
    assert.equal(cssUsesComicCodeLocal(homepageCss), false);
    assert.equal(homepageCss.includes("local('Comic Code')"), false);

    const fallback = extractCssVarFontFallback(homepageCss, HOMEPAGE_NOTES_CSS_PROPERTY);
    assert.equal(primaryFontFamily(fallback), HOMEPAGE_NOTES_PRIMARY_FAMILY);
    assert.equal(isHomepageNotesPrimary(fallback), true);
    assert.equal(fallback.replace(/\s+/g, ' '), HOMEPAGE_NOTES_FONT_STACK);

    assert.equal(homepageNotesCssTargetsBothLangs(homepageCss), true);
    assert.match(homepageCss, /#featured-notes|#latest-notes|\.homepage-notes/);
    assert.equal(/font-family:\s*'IBM Plex Sans'/.test(fallback), false);
  });

  test('homepage notes re-enable Maple Mono calt ligatures over body feature-settings', () => {
    const settings = homepageNotesLigatureFeatureSettings();
    for (const tag of ['calt', 'liga', 'clig', 'dlig', 'ss03', 'ss07', 'ss08', 'ss09', 'ss10', 'ss11']) {
      assert.match(settings, new RegExp(`["']${tag}["']\\s*1`), `${tag} must be on`);
    }
    assert.equal(/["']calt["']\s*0/.test(settings), false);
    assert.equal(
      /["']ss01["']\s*1/.test(settings),
      false,
      'ss01 is Maple Mono broken ==/!= ligatures and must stay off'
    );
    assert.equal(/["']ss02["']\s*1/.test(settings), false);
    assert.equal(/["']ss04["']\s*1/.test(settings), false);
    assert.equal(/["']ss06["']\s*1/.test(settings), false);
    assert.equal(cssEnablesMapleMonoLigatures(homepageCss), true);
    assert.equal(cssEnablesMapleMonoLigatures(homepageNotesFontFaceCss()), false);
    assert.equal(/["']ss01["']\s*1/.test(homepageCss), false);
    assert.match(homepageCss, /["']ss07["']\s*1/);
    assert.match(homepageCss, /["']ss11["']\s*1/);
  });

  test('index.astro wires featured and latest notes to the shipped Maple Mono NF CN style', () => {
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

  test('code snippets use Maple Mono NF CN with calt ligatures on every page', () => {
    const snippetCss = mapleMonoCodeSnippetCss();
    assert.equal(cssAppliesMapleMonoToCodeSnippets(snippetCss), true);
    assert.match(snippetCss, /\.astro-code/);
    assert.match(snippetCss, /font-feature-settings/);
    assert.match(snippetCss, /["']calt["']\s*1/);
    assert.match(snippetCss, /["']ss07["']\s*1/);
    assert.match(snippetCss, /["']ss08["']\s*1/);
    assert.match(snippetCss, /["']ss11["']\s*1/);
    assert.equal(
      /["']ss01["']\s*1/.test(snippetCss),
      false,
      'code snippets must not enable Maple Mono ss01 (broken ==/!=)'
    );
    assert.equal(isHomepageNotesPrimary(HOMEPAGE_NOTES_FONT_STACK), true);

    const layout = readFileSync(join(here, '../layouts/BaseLayout.astro'), 'utf8');
    assert.match(layout, /homepageNotesFontFaceCss\(\)/);
    assert.match(layout, /mapleMonoCodeSnippetCss\(\)/);
  });

  test('self-hosted NF CN WOFF2 and OFL-1.1 text are present', () => {
    assert.equal(existsSync(woff2Path), true, `${HOMEPAGE_NOTES_WOFF2_FILE} must exist`);
    assert.ok(statSync(woff2Path).size > 1000, 'WOFF2 must be non-empty');
    assert.equal(existsSync(oflPath), true, 'OFL.txt must exist');
    const ofl = readFileSync(oflPath, 'utf8');
    assert.match(ofl, /SIL Open Font License, Version 1\.1/);
    assert.match(ofl, /Maple Mono Project Authors/);
    assert.equal(woff2Path.endsWith(HOMEPAGE_NOTES_WOFF2_FILE), true);
  });
});
