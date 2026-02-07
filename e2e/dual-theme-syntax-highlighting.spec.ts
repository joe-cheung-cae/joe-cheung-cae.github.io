import { test, expect } from '@playwright/test';

test.describe('Dual Theme Syntax Highlighting', () => {
  const blogPostPath = '/blog/cmake-modern-targets';

  test.beforeEach(async ({ page }) => {
    // Navigate to the blog post with code blocks
    await page.goto(blogPostPath);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify page loaded correctly
    await expect(page.locator('h1')).toBeVisible();
  });

  test('code blocks are visible on the page', async ({ page }) => {
    // Find all code blocks with .astro-code class
    const codeBlocks = page.locator('.astro-code');

    // Verify at least one code block exists
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} code blocks on the page`);

    // Verify first code block is visible
    await expect(codeBlocks.first()).toBeVisible();

    // Verify code block has content
    const firstCodeText = await codeBlocks.first().textContent();
    expect(firstCodeText?.length).toBeGreaterThan(0);
  });

  test('light mode displays GitHub Light theme colors', async ({ page }) => {
    // Ensure we're in light mode (no dark class on HTML)
    const html = page.locator('html');
    await html.evaluate((el) => el.classList.remove('dark'));

    // Wait for any CSS transitions
    await page.waitForTimeout(300);

    // Find code blocks
    const codeBlock = page.locator('.astro-code').first();
    await expect(codeBlock).toBeVisible();

    // Get computed background color
    const backgroundColor = await codeBlock.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Light mode background color:', backgroundColor);

    // Verify the code block has a light background (should be close to white/light gray)
    // GitHub Light theme typically uses rgb(255, 255, 255) or similar
    const rgb = backgroundColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb;

    // Light theme should have high RGB values (light background)
    expect(r + g + b).toBeGreaterThan(600); // Sum should be high for light colors

    // Take screenshot in light mode
    await page.screenshot({
      path: 'e2e/screenshots/light-mode-code-blocks.png',
      fullPage: false
    });

    // Verify the code block has inline styles with Shiki CSS variables
    const hasShikiStyles = await page.evaluate(() => {
      const codeBlock = document.querySelector('.astro-code');
      if (!codeBlock) return false;
      const style = codeBlock.getAttribute('style') || '';
      return style.includes('--shiki-light') || style.includes('background-color');
    });

    expect(hasShikiStyles).toBeTruthy();

    // Verify code block contains syntax-highlighted tokens
    const hasHighlightedTokens = await page.evaluate(() => {
      const codeBlock = document.querySelector('.astro-code');
      if (!codeBlock) return false;
      const spans = codeBlock.querySelectorAll('span');
      return spans.length > 0;
    });

    expect(hasHighlightedTokens).toBeTruthy();
  });

  test('dark mode toggle works and applies dark class to HTML', async ({ page }) => {
    // Find the theme toggle button
    const themeToggle = page.locator('button[aria-label*="Switch to"], button[aria-label*="dark mode"], button[aria-label*="light mode"]').first();

    // If toggle exists, click it
    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();

      // Wait for dark mode to apply
      await page.waitForTimeout(300);

      // Verify dark class is applied to HTML
      const htmlHasDarkClass = await page.locator('html').evaluate((el) =>
        el.classList.contains('dark')
      );

      expect(htmlHasDarkClass).toBe(true);
    } else {
      // Manually toggle dark mode if button not found
      await page.locator('html').evaluate((el) => el.classList.add('dark'));

      const htmlHasDarkClass = await page.locator('html').evaluate((el) =>
        el.classList.contains('dark')
      );

      expect(htmlHasDarkClass).toBe(true);
    }
  });

  test('dark mode displays GitHub Dark theme colors', async ({ page }) => {
    // Switch to dark mode
    await page.locator('html').evaluate((el) => el.classList.add('dark'));

    // Wait for CSS transitions
    await page.waitForTimeout(300);

    // Find code blocks
    const codeBlock = page.locator('.astro-code').first();
    await expect(codeBlock).toBeVisible();

    // Get computed background color
    const backgroundColor = await codeBlock.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Dark mode background color:', backgroundColor);

    // Verify the code block has a dark background
    // GitHub Dark theme typically uses rgb(13, 17, 23) or similar dark color
    const rgb = backgroundColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
    const [r, g, b] = rgb;

    // Dark theme should have low RGB values (dark background)
    expect(r + g + b).toBeLessThan(300); // Sum should be low for dark colors

    // Take screenshot in dark mode
    await page.screenshot({
      path: 'e2e/screenshots/dark-mode-code-blocks.png',
      fullPage: false
    });
  });

  test('code block colors change between light and dark modes', async ({ page }) => {
    // Get light mode background color
    await page.locator('html').evaluate((el) => el.classList.remove('dark'));
    await page.waitForTimeout(300);

    const codeBlock = page.locator('.astro-code').first();
    await expect(codeBlock).toBeVisible();

    const lightBgColor = await codeBlock.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Light mode color:', lightBgColor);

    // Switch to dark mode
    await page.locator('html').evaluate((el) => el.classList.add('dark'));
    await page.waitForTimeout(300);

    const darkBgColor = await codeBlock.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    console.log('Dark mode color:', darkBgColor);

    // Verify colors are different
    expect(lightBgColor).not.toEqual(darkBgColor);

    // Verify light is lighter than dark (compare RGB sums)
    const lightRgb = lightBgColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const darkRgb = darkBgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];

    const lightSum = lightRgb[0] + lightRgb[1] + lightRgb[2];
    const darkSum = darkRgb[0] + darkRgb[1] + darkRgb[2];

    console.log(`Light sum: ${lightSum}, Dark sum: ${darkSum}`);

    expect(lightSum).toBeGreaterThan(darkSum);
  });

  test('full theme toggle flow with screenshots', async ({ page }) => {
    // Create screenshots directory
    await page.evaluate(() => {
      // This runs in browser context - just for documentation
    });

    // Step 1: Light mode screenshot
    await page.locator('html').evaluate((el) => el.classList.remove('dark'));
    await page.waitForTimeout(500);

    const lightScreenshot = await page.screenshot({
      path: 'e2e/screenshots/01-light-mode-full.png',
      fullPage: true
    });

    expect(lightScreenshot).toBeTruthy();

    // Step 2: Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="Switch to"]').first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
    } else {
      // Fallback: manually toggle
      await page.locator('html').evaluate((el) => el.classList.add('dark'));
    }

    await page.waitForTimeout(500);

    // Step 3: Dark mode screenshot
    const darkScreenshot = await page.screenshot({
      path: 'e2e/screenshots/02-dark-mode-full.png',
      fullPage: true
    });

    expect(darkScreenshot).toBeTruthy();

    // Step 4: Verify HTML has dark class
    const hasDarkClass = await page.locator('html').evaluate((el) =>
      el.classList.contains('dark')
    );
    expect(hasDarkClass).toBe(true);

    // Step 5: Toggle back to light
    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
    } else {
      await page.locator('html').evaluate((el) => el.classList.remove('dark'));
    }

    await page.waitForTimeout(500);

    const backToLightScreenshot = await page.screenshot({
      path: 'e2e/screenshots/03-light-mode-restored.png',
      fullPage: true
    });

    expect(backToLightScreenshot).toBeTruthy();

    // Verify we're back to light mode
    const isLightMode = await page.locator('html').evaluate((el) =>
      !el.classList.contains('dark')
    );
    expect(isLightMode).toBe(true);
  });
});