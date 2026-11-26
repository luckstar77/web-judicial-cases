import { defineConfig, devices } from '@playwright/test';

const PORT = 5199;
const BASE_URL = `http://localhost:${PORT}`;
const IS_CI = Boolean(process.env.CI);
const WEB_SERVER_TIMEOUT_MS = 120_000;

/** E2E smoke tests：以 mock 模式（MSW）啟動 dev server，不需要後端。 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 1 : 0,
  // CI 另外輸出 HTML 報告，失敗時由 workflow 上傳成 artifact
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    locale: 'zh-TW',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev:mock -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: WEB_SERVER_TIMEOUT_MS,
  },
});
