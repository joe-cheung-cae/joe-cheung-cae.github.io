import { defineConfig, devices } from '@playwright/test';

const localhostHosts = ['localhost', '127.0.0.1', '::1'];
const existingNoProxy = (process.env.NO_PROXY ?? process.env.no_proxy ?? '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);
process.env.NO_PROXY = [...new Set([...existingNoProxy, ...localhostHosts])].join(',');
process.env.no_proxy = process.env.NO_PROXY;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx serve dist -p 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});