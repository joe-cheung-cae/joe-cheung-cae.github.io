import { expect, test, type Page } from '@playwright/test';

const ZH_ROUTES = [
  '/',
  '/blog',
  '/blog/how-i-take-notes',
  '/projects',
  '/about',
  '/search',
  '/tags',
  '/languages',
  '/gallery',
] as const;

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

async function setZh(page: Page) {
  const toggle = page.getByRole('button', { name: /Switch to Chinese|切换到中文|切换到英文/ });
  await expect(toggle).toBeVisible();
  const current = await page.locator('html').getAttribute('data-lang');
  if (current !== 'zh') {
    await page.getByRole('button', { name: /Switch to Chinese|切换到中文/ }).click();
  }
  await expect(page.locator('html')).toHaveAttribute('data-lang', 'zh');
}

async function assertHiddenEnglishUi(page: Page) {
  const hidden = await page.locator('.i18n-en').evaluateAll((nodes) =>
    nodes
      .filter((node) => node instanceof HTMLElement)
      .map((node) => {
        const style = getComputedStyle(node);
        return {
          text: (node.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
          display: style.display,
          visibility: style.visibility,
          hidden: style.display === 'none' || style.visibility === 'hidden',
        };
      })
  );
  expect(hidden.length).toBeGreaterThan(0);
  for (const node of hidden) {
    expect(node.hidden, `English UI still visible: ${node.text}`).toBe(true);
  }
}

test.describe('zh mode UI copy', () => {
  for (const path of ZH_ROUTES) {
    test(`${path} shows Chinese UI and hides English UI spans`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await enterHomeIfNeeded(page);
      await setZh(page);

      const body = ((await page.locator('body').innerText()) ?? '').replace(/\s+/g, ' ');
      expect(body).toMatch(/[\u3400-\u9fff]/);
      expect(page.locator('.i18n-zh').first()).toBeTruthy();
      await expect(page.locator('.i18n-zh').first()).toBeVisible();

      if (path === '/') {
        await expect(page.getByRole('heading', { name: '从这里开始' })).toBeVisible();
        await expect(page.getByText('快速预览').first()).toBeVisible();
        await expect(page.getByText('阅读笔记').first()).toBeVisible();
        await expect(page.getByText('精选笔记').first()).toBeVisible();
        await expect(page.getByText('最近笔记').first()).toBeVisible();
        await expect(page.getByText('精选项目').first()).toBeVisible();
      }

      if (path === '/blog') {
        await expect(page.getByRole('heading', { name: '笔记' }).first()).toBeVisible();
        await expect(page.getByText('阅读全文').first()).toBeVisible();
        await expect(page.getByText('分钟阅读').first()).toBeVisible();
      }

      if (path === '/blog/how-i-take-notes') {
        await expect(page.getByRole('heading', { name: '我如何做技术笔记' })).toBeVisible();
        await expect(page.getByText('分钟阅读').first()).toBeVisible();
        await expect(page.getByText('本页目录').first()).toBeVisible();
      }

      if (path === '/projects') {
        await expect(page.getByRole('heading', { name: '项目' }).first()).toBeVisible();
        await expect(page.getByText('GitHub 主页').first()).toBeVisible();
      }

      if (path === '/about') {
        await expect(page.getByRole('heading', { name: '关于' }).first()).toBeVisible();
        await expect(page.getByText('在做什么').first()).toBeVisible();
        const contactEmail = page.locator('.prose-custom li').filter({ has: page.locator('a[href^="mailto:"]') });
        await expect(contactEmail.getByText('邮箱')).toBeVisible();
        await expect(contactEmail.getByText('Email:')).not.toBeVisible();
      }

      if (path === '/search') {
        await expect(page.getByRole('heading', { name: '搜索' }).first()).toBeVisible();
        await expect(page.getByText('搜索提示').first()).toBeVisible();
        await page.locator('#search-trigger').click();
        const searchInput = page.locator('[data-search-input]');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveAttribute('placeholder', '搜索笔记、标签或语言…');
        await expect(page.getByText('导航').first()).toBeVisible();
        await expect(page.getByText('选择').first()).toBeVisible();
      }

      if (path === '/tags') {
        await expect(page.getByRole('heading', { name: '标签' }).first()).toBeVisible();
        await expect(page.getByText('篇笔记').first()).toBeVisible();
      }

      if (path === '/languages') {
        await expect(page.getByRole('heading', { name: '语言' }).first()).toBeVisible();
        await expect(page.getByText('查看全部').first()).toBeVisible();
      }

      if (path === '/gallery') {
        await expect(page.getByRole('heading', { name: '相册' }).first()).toBeVisible();
      }

      await expect(page.getByRole('button', { name: /切换到英文/ })).toBeVisible();
      await assertHiddenEnglishUi(page);
    });
  }

  test('search, theme, and language keyboard flows still work in zh', async ({ page }) => {
    await page.goto('/');
    await enterHomeIfNeeded(page);
    await setZh(page);

    await page.locator('#search-trigger').click();
    const searchInput = page.locator('[data-search-input]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('cpp');
    const results = page.locator('.fixed.inset-0.z-50 ul li a');
    await expect(results.first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(searchInput).toHaveCount(0);

    const lang = page.getByRole('button', { name: /切换到英文/ });
    await expect(lang).toBeVisible();
    await lang.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');

    const theme = page.getByRole('button', { name: /Switch to (dark|light) mode|切换到(深色|浅色)模式/ });
    await expect(theme).toBeVisible();
    await theme.click();
  });
});
