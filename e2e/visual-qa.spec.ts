import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const scratch = process.env.VISUAL_QA_DIR || '/tmp/grok-goal-a64759ec8e08/implementer/screenshots';

async function enterHomeIfNeeded(page: Page) {
  const root = page.locator('#homepage');
  if ((await root.count()) === 0) return;
  await expect(async () => {
    const state = await root.getAttribute('data-page-transition');
    if (state === 'intro') {
      await page.locator('.homepage-enter').click();
    }
    await expect(root).toHaveAttribute('data-page-transition', 'main');
  }).toPass({ timeout: 8000 });
}

async function setLang(page: Page, lang: 'en' | 'zh') {
  const current = await page.locator('html').getAttribute('data-lang');
  if (current === lang) return;
  const name =
    lang === 'zh' ? /Switch to Chinese|切换到中文/ : /Switch to English|切换到英文/;
  await page.getByRole('button', { name }).click();
  await expect(page.locator('html')).toHaveAttribute('data-lang', lang);
}

async function shot(page: Page, name: string) {
  mkdirSync(scratch, { recursive: true });
  await page.screenshot({ path: join(scratch, `${name}.png`), fullPage: true });
}

for (const width of [1440, 390] as const) {
  test.describe(`${width}px visual qa`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 900 } });

    test(`en and zh homepage, search, and notes chrome (${width})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await enterHomeIfNeeded(page);
      await setLang(page, 'en');
      await shot(page, `home-en-${width}`);

      await page.locator('#search-trigger').click();
      await expect(page.locator('[data-search-input]')).toBeVisible();
      await shot(page, `search-en-${width}`);
      await page.keyboard.press('Escape');

      await setLang(page, 'zh');
      await shot(page, `home-zh-${width}`);
      await page.locator('#search-trigger').click();
      await expect(page.locator('[data-search-input]')).toBeVisible();
      await shot(page, `search-zh-${width}`);
      await page.keyboard.press('Escape');

      await page.goto('/blog');
      await setLang(page, 'zh');
      await shot(page, `blog-zh-${width}`);

      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
      await page.goto('/');
      await enterHomeIfNeeded(page);
      await page.locator('html').evaluate((el) => el.classList.add('dark'));
      await shot(page, `home-zh-dark-${width}`);
    });
  });
}
