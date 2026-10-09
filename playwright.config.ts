import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalTimeout: process.env.CI ? 30 * 60_000 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  outputDir: 'test-results',
  reporter: process.env.CI
    ? [
        ['line'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.api.spec.ts',
    },
    {
      name: 'e2e-chromium',
      testMatch: '**/e2e/**/*.e2e.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'e2e-chrome',
      testMatch: '**/e2e/**/*.e2e.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
