import { LOCALE_META, type Locale } from '../i18n/locales';

/** '2026-09-20' → 2026年9月20日(日)（言語に合わせた表記） */
export function formatDate(ymd: string | Date, lang: Locale, opts: { weekday?: boolean; year?: boolean } = {}): string {
  const d = typeof ymd === 'string' ? new Date(`${ymd}T00:00:00Z`) : ymd;
  return new Intl.DateTimeFormat(LOCALE_META[lang].htmlLang, {
    timeZone: typeof ymd === 'string' ? 'UTC' : 'Asia/Tokyo',
    year: opts.year === false ? undefined : 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: opts.weekday ? 'short' : undefined,
  }).format(d);
}

/** Date → '2026-09-20'（日本時間） */
export function toYmd(d: Date): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(d);
}

/** 括弧書き。日本語・中国語は全角「（…）」、英語は半角「 (…)」 */
export function paren(lang: Locale, text: string): string {
  return lang === 'en' ? ` (${text})` : `（${text}）`;
}

/** 「見出し：内容」の区切り。日本語・中国語は全角「：」、英語は「: 」 */
export function colon(lang: Locale): string {
  return lang === 'en' ? ': ' : '：';
}
