import { test, expect, type Page } from '@playwright/test';
import { homepageConfig } from '../src/homepage.config';

const NAME = homepageConfig.intro.title;
const ROLE_EN = homepageConfig.intro.subtitle.en;
const ROLE_ZH = homepageConfig.intro.subtitle.zh;

async function gotoHome(page: Page, reducedMotion: 'no-preference' | 'reduce') {
  await page.emulateMedia({ reducedMotion });
  await page.goto('/');
  await expect(page.locator('#homepage')).toBeAttached();
}

async function enterMain(page: Page) {
  const root = page.locator('#homepage');
  await expect(async () => {
    const state = await root.getAttribute('data-page-transition');
    if (state === 'intro') {
      await page.locator('.homepage-enter').click({ trial: false });
    }
    await expect(root).not.toHaveAttribute('data-page-transition', 'intro');
  }).toPass({ timeout: 5000 });
  await expect(root).toHaveAttribute('data-page-transition', 'main', { timeout: 4000 });
}

test.describe('homepage identity and fluid', () => {
  test('shows config-backed name and role on /', async ({ page }) => {
    await gotoHome(page, 'no-preference');

    await expect(page.locator('.homepage-intro-title')).toHaveText(NAME);
    await expect(page.locator('.homepage-intro-subtitle .i18n-en')).toHaveText(ROLE_EN);
    await expect(page.locator('.homepage-card-name')).toHaveText(NAME);
    await expect(page.locator('.homepage-card-signature .i18n-en')).toHaveText(ROLE_EN);

    await page.locator('html').evaluate((el) => el.setAttribute('data-lang', 'zh'));
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'zh');
    await expect(page.locator('.homepage-intro-subtitle .i18n-zh')).toBeVisible();
    await expect(page.locator('.homepage-intro-subtitle .i18n-zh')).toHaveText(ROLE_ZH);
    await expect(page.locator('.homepage-card-signature .i18n-zh')).toBeVisible();
    await expect(page.locator('.homepage-card-signature .i18n-zh')).toHaveText(ROLE_ZH);
  });

  test('fluid canvas is present when background is enabled and motion is allowed', async ({
    page,
  }) => {
    await gotoHome(page, 'no-preference');

    const root = page.locator('#homepage');
    await expect(root).toHaveAttribute('data-fluid-background', 'on');
    await expect(page.locator('canvas#background')).toBeAttached();
    await expect(page.locator('canvas#background')).toHaveCount(1);
  });

  test('fluid canvas is absent under reduced motion (e2e stand-in for background off)', async ({
    page,
  }) => {
    // Compile-time intro.background === false is not a single-dist case.
    // E2E "off" is prefers-reduced-motion: reduce (same shouldStartFluid false branch).
    await gotoHome(page, 'reduce');

    const root = page.locator('#homepage');
    await expect(root).toHaveAttribute('data-fluid-background', 'off');
    await expect(page.locator('canvas#background')).toHaveCount(0);
    await expect(root).toHaveAttribute('data-page-transition', 'main');
  });
});

test.describe('homepage transition', () => {
  test('enter advances data-page-transition and intro leaves', async ({ page }) => {
    await gotoHome(page, 'no-preference');

    const root = page.locator('#homepage');
    await expect(root).toHaveAttribute('data-page-transition', 'intro');

    const seen: string[] = [];
    await page.exposeFunction('recordTransition', (value: string) => {
      seen.push(value);
    });
    await page.evaluate(() => {
      const node = document.getElementById('homepage');
      if (!node) return;
      const notify = (window as unknown as { recordTransition: (v: string) => void })
        .recordTransition;
      notify(node.getAttribute('data-page-transition') ?? '');
      new MutationObserver(() => {
        notify(node.getAttribute('data-page-transition') ?? '');
      }).observe(node, { attributes: true, attributeFilter: ['data-page-transition'] });
    });

    await enterMain(page);

    expect(seen.some((state) => state === 'busy' || state === 'main')).toBe(true);
    await expect(root).toHaveAttribute('data-page-transition', 'main');
    await expect(page.locator('.homepage-intro')).not.toBeVisible();
    await expect(page.locator('.homepage-card-name')).toBeVisible();
  });

  test('reduced motion skips a long busy and lands on main', async ({ page }) => {
    await gotoHome(page, 'reduce');

    const root = page.locator('#homepage');
    await expect(root).toHaveAttribute('data-page-transition', 'main');
    await expect(root).not.toHaveAttribute('data-page-transition', 'busy');
    await expect(page.locator('canvas#background')).toHaveCount(0);
    await expect(page.locator('.homepage-card-name')).toBeVisible();
  });
});

test.describe('homepage 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('intro shows identity and enter; main shows name, role, and card nav', async ({
    page,
  }) => {
    await gotoHome(page, 'no-preference');

    await expect(page.locator('.homepage-intro-title')).toBeVisible();
    await expect(page.locator('.homepage-intro-title')).toHaveText(NAME);
    const enter = page.locator('.homepage-enter');
    await expect(enter).toBeVisible();
    await expect(enter).not.toHaveText('');

    await enterMain(page);

    await expect(page.locator('.homepage-card-name')).toBeVisible();
    await expect(page.locator('.homepage-card-signature .i18n-en')).toBeVisible();
    await expect(page.locator('.homepage-card-signature .i18n-en')).toHaveText(ROLE_EN);

    const cardNav = page.locator('.homepage-card-nav');
    await expect(cardNav).toBeVisible();
    await expect(cardNav.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(cardNav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(cardNav.getByRole('link', { name: 'Email' })).toBeVisible();
    await expect(cardNav.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(cardNav.locator('a[href="/gallery"]')).toBeVisible();
    await expect(cardNav.getByRole('link', { name: /Gallery|相册/ })).toBeVisible();
    await expect(page.locator('button[aria-label*="menu" i], button[aria-label*="hamburger" i]')).toHaveCount(
      0
    );
  });

  test('critical controls have non-empty accessible names or text', async ({ page }) => {
    await gotoHome(page, 'no-preference');

    const search = page.locator('#search-trigger');
    await expect(search).toBeVisible();
    await expect(search).toHaveAttribute('aria-label', /search/i);

    const lang = page.getByRole('button', { name: /Switch to Chinese|切换到英文/ });
    await expect(lang).toBeVisible();
    expect((await lang.innerText()).trim().length).toBeGreaterThan(0);

    const theme = page.getByRole('button', { name: /Switch to (dark|light) mode/ });
    await expect(theme).toBeVisible();

    const enter = page.locator('.homepage-enter');
    await expect(enter).toBeVisible();
    expect((await enter.innerText()).trim().length).toBeGreaterThan(0);

    await enterMain(page);

    const cardLinks = page.locator('.homepage-card-nav a');
    expect(await cardLinks.count()).toBeGreaterThanOrEqual(4);
    for (const text of await cardLinks.allTextContents()) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });
});
