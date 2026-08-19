import { test, expect, type Page } from '@playwright/test';

async function gotoBlog(page: Page) {
  await page.goto('/blog');
  await expect(page.locator('#notes-menu, aside#menu').first()).toBeAttached();
}

test.describe('notes chrome and list', () => {
  test('/blog ships notes drawer, cards, cover, read more, and tags', async ({ page }) => {
    await gotoBlog(page);

    await expect(page.locator('#notes-menu')).toBeAttached();
    expect(await page.locator('article.article-card').count()).toBeGreaterThanOrEqual(1);

    const cover = page.locator('.canvas-cover, .post-cover').first();
    await expect(cover).toBeAttached();

    const more = page.locator('a.post-more').first();
    await expect(more).toBeAttached();
    const moreText = ((await more.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    expect(moreText.length).toBeGreaterThan(0);
    expect(await more.locator('.i18n-en').textContent()).toMatch(/Read more/);
    expect(await more.locator('.i18n-zh').textContent()).toMatch(/阅读全文/);

    const tagLink = page.locator('article.article-card a[href*="/tags/"]').first();
    await expect(tagLink).toBeAttached();
    expect(((await tagLink.textContent()) ?? '').trim().length).toBeGreaterThan(0);

    await expect(page.locator('#search-trigger')).toHaveCount(1);
    await expect(page.locator('canvas#background')).toHaveCount(0);
  });

  test('opening the first article-card title lands on the post article', async ({ page }) => {
    await gotoBlog(page);

    const titleLink = page.locator('article.article-card h3.post-title a').first();
    await expect(titleLink).toBeAttached();
    const href = await titleLink.getAttribute('href');
    expect(href).toBeTruthy();

    await titleLink.click();
    await expect(page.locator('h1.post-card-title, article.post-article').first()).toBeAttached();
    await expect(page.locator('h1.post-card-title')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('canvas#background')).toHaveCount(0);
    expect(((await page.locator('h1.post-card-title').textContent()) ?? '').trim().length).toBeGreaterThan(
      0
    );
    await expect(page).toHaveURL(new RegExp(`${href?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
  });

  test('first-paint search trigger is unique on notes and search routes', async ({ page }) => {
    for (const path of ['/blog', '/gallery', '/search']) {
      await page.goto(path);
      await expect(page.locator('#search-trigger')).toHaveCount(1);
    }
  });
});

test.describe('gallery and homepage gallery link', () => {
  test('/gallery is a notes album page with Gallery nav', async ({ page }) => {
    const response = await page.goto('/gallery');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('#album-page')).toBeAttached();
    await expect(page.locator('#notes-menu')).toBeAttached();

    const galleryNav = page.locator('#notes-menu nav').getByRole('link', { name: /Gallery|相册/ });
    await expect(galleryNav).toBeAttached();
    await expect(galleryNav).toHaveAttribute('href', /\/gallery\/?$/);

    const empty = page.locator('#album-page .album-empty');
    if ((await empty.count()) > 0) {
      expect(((await empty.locator('.i18n-en').textContent()) ?? '').trim().length).toBeGreaterThan(0);
      expect(((await empty.locator('.i18n-zh').textContent()) ?? '').trim().length).toBeGreaterThan(0);
    }
  });

  test('reduced-motion homepage identity card links to gallery', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#homepage')).toHaveAttribute('data-page-transition', 'main');

    const cardNav = page.locator('.homepage-card-nav');
    await expect(cardNav).toBeVisible();
    const gallery = cardNav.locator('a[href="/gallery"]');
    await expect(gallery).toBeVisible();
    await expect(cardNav.getByRole('link', { name: /Gallery|相册/ })).toBeVisible();
    await expect(page.locator('#search-trigger')).toHaveCount(1);
  });
});

test.describe('notes 390px drawer', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('menu toggle opens Notes nav on /blog', async ({ page }) => {
    await gotoBlog(page);

    const toggle = page.locator('#menu-toggle');
    await expect(toggle).toBeVisible();
    await expect(page.locator('#notes-menu')).not.toHaveClass(/is-open/);

    await toggle.click();
    await expect(page.locator('#notes-menu')).toHaveClass(/is-open/);
    const notesLink = page.locator('#notes-menu nav').getByRole('link', { name: /Notes|笔记/ });
    await expect(notesLink).toBeVisible();
    await expect(notesLink).toBeInViewport();

    await toggle.click();
    await expect(page.locator('#notes-menu')).not.toHaveClass(/is-open/);
  });
});
