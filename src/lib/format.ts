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
