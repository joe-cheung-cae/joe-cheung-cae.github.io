import { test, expect } from '@playwright/test';

test('homepage cards do not render empty clickable anchors', async ({ page }) => {
  await page.goto('/');

  const startHereSection = page.locator('#featured-notes');
  await expect(startHereSection).toBeAttached();
  await expect(
    startHereSection.getByRole('heading', { name: /Start Here|从这里开始/ })
  ).toBeAttached();

  const cardAnchors = startHereSection.locator('article a');
  await expect(cardAnchors).not.toHaveCount(0);
  expect(await cardAnchors.count()).toBeGreaterThanOrEqual(1);

  const texts = (await cardAnchors.allTextContents()).map((text) => text.trim());
  const emptyAnchors = texts.filter((text) => text.length === 0);

  expect(emptyAnchors.length).toBe(0);
});
