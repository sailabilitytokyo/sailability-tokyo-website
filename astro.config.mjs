// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 言語の一覧は src/i18n/locales.ts と揃えること
export default defineConfig({
  site: 'https://www.sailabilitytokyo.jp',
  // 旧 Google Sites と同じ「末尾スラッシュなし」の URL（/about など）にする
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    locales: ['ja', 'en', 'zh-hans', 'zh-hant'],
    defaultLocale: 'ja',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja-JP',
          en: 'en',
          'zh-hans': 'zh-Hans',
          'zh-hant': 'zh-Hant',
        },
      },
    }),
  ],
});
