import { expect, test } from '@playwright/test';
import {
  HOMEPAGE_NOTES_PRIMARY_FAMILY,
  isHomepageNotesPrimary,
  primaryFontFamily,
} from '../src/lib/homepage-notes-font';

test('post code snippets use Maple Mono NF CN with calt ligatures', async ({ page }) => {
  await page.goto('/blog/cpp-move-semantics');
  const code = page.locator('pre.astro-code').filter({ hasText: '&&' }).first();
  await expect(code).toBeVisible();
  await expect(code).toContainText('&&');

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const computed = await code.evaluate((el) => ({
    family: getComputedStyle(el).fontFamily,
    features: getComputedStyle(el).fontFeatureSettings,
    ligatures: getComputedStyle(el).fontVariantLigatures,
  }));

  expect(isHomepageNotesPrimary(computed.family)).toBe(true);
  expect(primaryFontFamily(computed.family)).toBe(HOMEPAGE_NOTES_PRIMARY_FAMILY);
  expect(computed.features).toMatch(/calt/);
  expect(computed.ligatures).toMatch(/contextual|common-ligatures|normal/i);

  const fontOk = await page.evaluate(
    async (family) => {
      await document.fonts.ready;
      return document.fonts.check(`16px "${family}"`);
    },
    HOMEPAGE_NOTES_PRIMARY_FAMILY
  );
  expect(fontOk).toBe(true);
});
