// 全ページの基本動作テスト。
// ライブラリ更新やデザイン変更で「ページが表示されない」「JavaScript エラーが出る」などの故障を検知する。
import { expect, test } from '@playwright/test';
import { allPagePaths } from './pages';

for (const path of allPagePaths()) {
  test(`${path} が正しく表示される`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    const res = await page.goto(path);
    expect(res?.status()).toBe(200);

    await expect(page.locator('header.site-header')).toBeVisible();
    await expect(page.locator('footer.site-footer')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Sailability Tokyo/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\//);

    // 画像には alt 属性が必要（装飾画像は alt="" を明示）
    for (const img of await page.locator('main img').all()) {
      expect(await img.getAttribute('alt'), `${await img.getAttribute('src')} に alt がありません`).not.toBeNull();
    }

    // 構造化データ（JSON-LD）が正しい JSON であること
    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(json)).not.toThrow();
    }

    expect(errors, 'ブラウザでエラーが発生しました').toEqual([]);
  });
}

test('スマートフォンでメニューを開閉できる', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'スマートフォン表示のみ');
  await page.goto('/');
  const toggle = page.locator('.site-nav__toggle');
  const nav = page.locator('#site-nav');
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('旧サイトの URL 用の転送設定がある', async ({ request }) => {
  const redirects = await (await request.get('/_redirects')).text();
  expect(redirects).toContain('/home');
  expect(redirects).toContain('/blog');
});

test('存在しないページは 404 ページを表示する', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
});
