import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  HOMEPAGE_NOTES_PRIMARY_FAMILY,
  HOMEPAGE_NOTES_WOFF2_PATH,
  isHomepageNotesPrimary,
  primaryFontFamily,
} from '../src/lib/homepage-notes-font';

const NOTE_REGIONS = ['#featured-notes', '#latest-notes'] as const;

async function gotoHomeAndEnter(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const root = page.locator('#homepage');
  await expect(root).toBeAttached();
  await expect(async () => {
    const state = await root.getAttribute('data-page-transition');
    if (state === 'intro') {
      await page.locator('.homepage-enter').click();
    }
    await expect(root).toHaveAttribute('data-page-transition', 'main');
  }).toPass({ timeout: 8000 });

  await expect(page.locator('#featured-notes')).toBeVisible();
  await expect(page.locator('#latest-notes')).toBeVisible();
  return errors;
}

async function setLang(page: Page, lang: 'en' | 'zh') {
  await page.locator('html').evaluate((el, next) => {
    el.setAttribute('data-lang', next);
    el.setAttribute('lang', next === 'zh' ? 'zh-Hans' : 'en');
    el.dispatchEvent(new CustomEvent('lang-change', { detail: { lang: next } }));
  }, lang);
  await expect(page.locator('html')).toHaveAttribute('data-lang', lang);
}

async function notesComputedStacks(page: Page, lang: 'en' | 'zh') {
  await setLang(page, lang);
  const visible = lang === 'en' ? '.i18n-en' : '.i18n-zh';
  const stacks: Array<{ region: string; role: string; stack: string }> = [];

  for (const region of NOTE_REGIONS) {
    const heading = page.locator(`${region} h2`).first();
    const copy = page.locator(`${region} ${visible}`).first();
    const body = page.locator(`${region} article h3, ${region} article p`).first();
    await expect(heading).toBeVisible();
    await expect(copy).toBeVisible();
    await expect(body).toBeVisible();

    const headingStack = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
    const copyStack = await copy.evaluate((el) => getComputedStyle(el).fontFamily);
    const bodyStack = await body.evaluate((el) => getComputedStyle(el).fontFamily);
    const headingFeatures = await heading.evaluate((el) => getComputedStyle(el).fontFeatureSettings);
    expect(headingFeatures, `${region} ligatures`).toMatch(/calt/);
    stacks.push(
      { region, role: 'heading', stack: headingStack },
      { region, role: `${lang}-copy`, stack: copyStack },
      { region, role: 'body', stack: bodyStack }
    );
  }

  return stacks;
}

async function writeEvidence(page: Page, dump: Record<string, unknown>): Promise<void> {
  const evidenceDir = process.env.NOTES_FONT_EVIDENCE_DIR;
  if (!evidenceDir) return;

  mkdirSync(evidenceDir, { recursive: true });
  await page.locator('#featured-notes').screenshot({
    path: join(evidenceDir, 'homepage-notes-font.png'),
  });
  writeFileSync(join(evidenceDir, 'notes-font-computed.json'), JSON.stringify(dump, null, 2));
}

async function assertMapleMonoLoaded(page: Page) {
  const fontOk = await page.evaluate(async (family) => {
    await document.fonts.ready;
    return document.fonts.check(`16px "${family}"`);
  }, HOMEPAGE_NOTES_PRIMARY_FAMILY);
  expect(fontOk).toBe(true);

  const fontResponse = await page.request.get(HOMEPAGE_NOTES_WOFF2_PATH);
  expect(fontResponse.status()).toBe(200);
  expect(fontResponse.headers()['content-type'] ?? '').toMatch(/font|woff2|octet-stream/i);
}

for (const run of [1, 2] as const) {
  test(`homepage notes use Maple Mono NF CN first for en and zh (run ${run})`, async ({
    page,
  }) => {
    const errors = await gotoHomeAndEnter(page);
    await assertMapleMonoLoaded(page);
    const dump: Record<string, unknown> = { run, errors, langs: {} };

    for (const lang of ['en', 'zh'] as const) {
      const stacks = await notesComputedStacks(page, lang);
      dump.langs = {
        ...(dump.langs as Record<string, unknown>),
        [lang]: stacks,
      };

      for (const { region, role, stack } of stacks) {
        expect(
          isHomepageNotesPrimary(stack),
          `${region} ${role} computed font-family: ${stack}`
        ).toBe(true);
        expect(
          primaryFontFamily(stack),
          `${region} ${role} primary family: ${stack}`
        ).toBe(HOMEPAGE_NOTES_PRIMARY_FAMILY);
        expect(primaryFontFamily(stack).toLowerCase().includes('ibm plex')).toBe(false);
        expect(primaryFontFamily(stack)).not.toBe('Comic Code');
      }
    }

    expect(errors).toEqual([]);

    if (run === 2) {
      await writeEvidence(page, dump);
    }
  });
}

test('blocked Maple Mono NF CN request does not overflow homepage notes', async ({ page }) => {
  await page.route(`**${HOMEPAGE_NOTES_WOFF2_PATH}`, (route) => route.abort());
  await gotoHomeAndEnter(page);

  const viewport = page.viewportSize();
  expect(viewport).toBeTruthy();

  for (const region of NOTE_REGIONS) {
    const box = await page.locator(region).boundingBox();
    expect(box, region).toBeTruthy();
    expect(box!.width).toBeGreaterThan(80);
    expect(box!.height).toBeGreaterThan(40);
    expect(box!.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 2);
  }

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 2);
});
