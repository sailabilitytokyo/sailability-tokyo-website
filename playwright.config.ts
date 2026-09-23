import { defineConfig, devices } from '@playwright/test';

// 表示確認テスト。`npm run build` 後に `npm test` で実行する。
// ビルド済みの dist/ を astro preview で配信し、ブラウザで各ページを開いて確認する。
// 開発サーバー（npm run dev, 4321番）と混ざらないよう、テスト専用のポートを使う。
const PORT = 4329;
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  // スクリーンショット比較の許容差（フォントのわずかな描画差で失敗しないように）
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
