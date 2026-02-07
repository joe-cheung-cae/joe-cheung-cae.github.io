import { test, expect } from '@playwright/test';

test('homepage cards do not render empty clickable anchors', async ({ page }) => {
  await page.goto('/');

  const startHereSection = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Start Here' }) });

  const cardAnchors = startHereSection.locator('article a');
  const texts = (await cardAnchors.allTextContents()).map((text) => text.trim());
  const emptyAnchors = texts.filter((text) => text.length === 0);

  expect(emptyAnchors.length).toBe(0);
});
