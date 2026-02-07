import { test, expect } from '@playwright/test';

const getSelectedIndex = async (page: Parameters<typeof test>[0]['page']) => {
  return page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.z-50');
    if (!modal) return -1;

    const items = Array.from(modal.querySelectorAll('ul li a'));
    return items.findIndex((item) => {
      const cls = item.className;
      return cls.includes('bg-notion-blue-light') || cls.includes('bg-blue-900/30');
    });
  });
};

test('search modal keyboard controls work even when input is not focused', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  await page.click('#search-trigger');
  const searchInput = page.locator('input[placeholder*="Search posts"]');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('cpp');

  const resultItems = page.locator('.fixed.inset-0.z-50 ul li a');
  await expect(resultItems.first()).toBeVisible();
  const resultCount = await resultItems.count();
  expect(resultCount).toBeGreaterThan(0);

  const beforeArrowDown = await getSelectedIndex(page);
  expect(beforeArrowDown).toBe(0);

  await page.click('text=to navigate');
  await page.keyboard.press('ArrowDown');
  await expect.poll(async () => getSelectedIndex(page)).toBe(1);
  const afterArrowDown = await getSelectedIndex(page);
  expect(afterArrowDown).toBe(1);

  await page.keyboard.press('Escape');
  await expect(searchInput).toHaveCount(0);
});

test('search modal still supports arrow navigation for IME-style key events', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  await page.click('#search-trigger');
  const searchInput = page.locator('input[placeholder*="Search posts"]');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('cpp');

  const selectedBefore = await getSelectedIndex(page);
  expect(selectedBefore).toBe(0);

  await searchInput.evaluate((input) => {
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'isComposing', { value: true });
    Object.defineProperty(event, 'keyCode', { value: 229 });
    input.dispatchEvent(event);
  });

  await expect.poll(async () => getSelectedIndex(page)).toBe(1);
  const selectedAfter = await getSelectedIndex(page);
  expect(selectedAfter).toBe(1);
});

test('search modal supports arrow navigation for c++ query without runtime errors', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  await page.click('#search-trigger');
  const searchInput = page.locator('input[placeholder*="Search posts"]');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('c++');

  const results = page.locator('.fixed.inset-0.z-50 ul li a');
  await expect(results.first()).toBeVisible();
  const resultsCount = await results.count();
  expect(resultsCount).toBeGreaterThan(0);

  const selectedBefore = await getSelectedIndex(page);
  await page.keyboard.press('ArrowDown');
  await expect.poll(async () => (await getSelectedIndex(page)) !== selectedBefore).toBe(true);
  const selectedAfter = await getSelectedIndex(page);

  expect(selectedAfter).not.toBe(selectedBefore);
  expect(pageErrors).toEqual([]);
});
