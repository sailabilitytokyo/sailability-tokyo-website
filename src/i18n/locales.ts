// サイトが対応する言語。astro.config.mjs の i18n.locales と揃えること。
// 日本語が正本（デフォルト）で、URL にプレフィックスが付かない（/about）。
// 他の言語は /en/about のようにプレフィックスが付く。
// 翻訳ファイル（src/content/pages/<lang>/*.md）が存在するページだけが生成される。
export const LOCALES = ['ja', 'en', 'zh-hans', 'zh-hant'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ja';

export const LOCALE_META: Record<Locale, { htmlLang: string; label: string }> = {
  ja: { htmlLang: 'ja', label: '日本語' },
  en: { htmlLang: 'en', label: 'English' },
  'zh-hans': { htmlLang: 'zh-Hans', label: '简体中文' },
  'zh-hant': { htmlLang: 'zh-Hant', label: '繁體中文' },
};

export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** 言語付きのパスを作る。localePath('en', '/about') → '/en/about' */
export function localePath(lang: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  if (lang === DEFAULT_LOCALE) return clean || '/';
  return `/${lang}${clean}`;
}
