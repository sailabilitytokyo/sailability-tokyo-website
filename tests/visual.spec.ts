// 見た目の比較テスト（ビジュアルリグレッションテスト）。
// 各ページのスクリーンショットを「基準画像」と比べ、意図しない見た目の変化を検知する。
//
// - 基準画像は tests/visual.spec.ts-snapshots/ に保存されている（CI の Linux 環境で作成したもの）。
// - デザインを意図的に変えたときは、GitHub Actions の「Update screenshots」を実行して基準画像を更新する。
// - 基準画像がまだ無い場合、このテストはスキップされる。
// - 日程やお知らせは日付で内容が変わるので、比較対象から除外（マスク）している。
import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { allPagePaths } from './pages';

const snapshotDir = new URL('./visual.spec.ts-snapshots', import.meta.url);

test.beforeEach(({}, testInfo) => {
  const updating = ['all', 'changed'].includes(testInfo.config.updateSnapshots);
  test.skip(!existsSync(snapshotDir) && !updating, '基準画像がまだありません（Update screenshots ワークフローで作成）');
});

for (const path of allPagePaths()) {
  test(`${path} の見た目が変わっていない`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // 遅延読み込みの画像を読み込ませるため、一度最下部までスクロールしてから戻る
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 300));
      window.scrollTo(0, 0);
    });
    const name = path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '__');
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator('.schedule'), page.locator('.news-list'), page.locator('.sticky-cta'), page.locator('.site-footer__bottom')],
    });
  });
}
