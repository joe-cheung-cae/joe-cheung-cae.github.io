import { expect, test, type Page } from '@playwright/test';
import {
  HOMEPAGE_NOTES_PRIMARY_FAMILY,
  isHomepageNotesPrimary,
  primaryFontFamily,
} from '../src/lib/homepage-notes-font';

async function mountLigatureProbe(
  page: Page,
  id: string,
  text: string,
  features: string
) {
  await page.evaluate(
    ({ id, text, features, family }) => {
      let root = document.getElementById('liga-probes');
      if (!root) {
        root = document.createElement('div');
        root.id = 'liga-probes';
        root.style.cssText =
          'position:fixed;left:0;top:0;z-index:99999;background:#ffffff;color:#111111;padding:16px;';
        document.body.appendChild(root);
      }
      const el = document.createElement('div');
      el.id = id;
      el.textContent = text;
      el.style.fontFamily = `"${family}"`;
      el.style.fontSize = '48px';
      el.style.lineHeight = '1.2';
      el.style.whiteSpace = 'nowrap';
      el.style.letterSpacing = '0';
      el.style.fontVariantLigatures = 'contextual';
      el.style.fontFeatureSettings = features;
      root.appendChild(el);
    },
    { id, text, features, family: HOMEPAGE_NOTES_PRIMARY_FAMILY }
  );
  return page.locator(`#${id}`);
}

test('post code snippets use Maple Mono NF CN with calt ligatures', async ({ page }) => {
  await page.goto('/blog/cpp-move-semantics');
  const equalsBlock = page.locator('pre.astro-code').filter({ hasText: '==' }).first();
  const notEqualsBlock = page.locator('pre.astro-code').filter({ hasText: '!=' }).first();
  await expect(equalsBlock).toBeVisible();
  await expect(notEqualsBlock).toBeVisible();

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const computed = await equalsBlock.evaluate((el) => ({
    family: getComputedStyle(el).fontFamily,
    features: getComputedStyle(el).fontFeatureSettings,
    ligatures: getComputedStyle(el).fontVariantLigatures,
    html: el.innerHTML,
  }));

  expect(isHomepageNotesPrimary(computed.family)).toBe(true);
  expect(primaryFontFamily(computed.family)).toBe(HOMEPAGE_NOTES_PRIMARY_FAMILY);
  expect(computed.features).toMatch(/calt/);
  expect(computed.features.toLowerCase()).not.toMatch(/ss01/);
  expect(computed.features.toLowerCase()).not.toMatch(/ss07/);
  expect(computed.features.toLowerCase()).not.toMatch(/ss11/);
  expect(computed.ligatures).toMatch(/contextual|common-ligatures|normal/i);
  expect(computed.html).not.toMatch(/=<\/span>\s*<span[^>]*>\s*=/);

  const fontOk = await page.evaluate(
    async (family) => {
      await document.fonts.ready;
      return document.fonts.check(`16px "${family}"`);
    },
    HOMEPAGE_NOTES_PRIMARY_FAMILY
  );
  expect(fontOk).toBe(true);

  const equalsOn = await mountLigatureProbe(page, 'eq-on', '==', '"calt" 1');
  const equalsOff = await mountLigatureProbe(page, 'eq-off', '==', '"calt" 0');
  const extraOn = await mountLigatureProbe(page, 'extra-on', '|= ~= >>=', '"calt" 1');
  const extraOff = await mountLigatureProbe(page, 'extra-off', '|= ~= >>=', '"calt" 0');

  await expect(equalsOn).toBeVisible();
  const equalsOnPng = Buffer.from(await equalsOn.screenshot());
  const equalsOffPng = Buffer.from(await equalsOff.screenshot());
  const extraOnPng = Buffer.from(await extraOn.screenshot());
  const extraOffPng = Buffer.from(await extraOff.screenshot());

  expect(equalsOnPng.equals(equalsOffPng), '== should ligature when calt is on').toBe(false);
  expect(extraOnPng.equals(extraOffPng), '|= ~= >>= should ligature from frozen calt').toBe(false);
});
