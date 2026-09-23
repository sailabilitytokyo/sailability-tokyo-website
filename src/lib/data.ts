// src/data/*.yaml を読み込み、形式をチェックする。
// 書き方を間違えるとビルドが失敗し、どのファイルのどの項目が悪いかが表示される。
import { parse } from 'yaml';
import { z } from 'astro/zod';
import siteRaw from '../data/site.yaml?raw';
import scheduleRaw from '../data/schedule.yaml?raw';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../i18n/locales';

/** 「日本語だけの文字列」または「言語ごとの文字列」 */
const localized = z.union([
  z.string(),
  z.object(Object.fromEntries(LOCALES.map((l) => [l, z.string().optional()]))).refine((v) => !!v[DEFAULT_LOCALE], {
    message: `${DEFAULT_LOCALE} は必須です`,
  }),
]);
export type Localized = z.infer<typeof localized>;

/** 言語ごとの文字列から、指定言語の文字列を取り出す（なければ日本語） */
export function pick(value: Localized | undefined, lang: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return (value as Record<string, string | undefined>)[lang] ?? (value as Record<string, string>)[DEFAULT_LOCALE];
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付は YYYY-MM-DD の形式で書いてください');
const time = z.string().regex(/^\d{1,2}:\d{2}$/, '時刻は HH:MM の形式で書いてください');

const siteSchema = z.object({
  name: z.string(),
  legalName: localized,
  tagline: z.string(),
  description: localized,
  foundedYear: z.number(),
  email: z.email(),
  officers: z.array(z.string()),
  officersNote: z.string().optional(),
  places: z.array(
    z.object({
      id: z.string(),
      name: localized,
      note: localized.optional(),
      addressLocality: z.string().optional(),
      addressRegion: z.string().optional(),
      mapUrl: z.url().optional(),
    }),
  ),
  forms: z.object({ experience: z.url() }),
  experience: z.object({ price: z.number() }),
  nav: z.array(z.string()),
  social: z.array(z.object({ name: z.string(), url: z.url() })),
  blogArchiveUrl: z.url(),
  analytics: z.object({ ga4: z.string().optional(), hosts: z.array(z.string()) }),
  sponsors: z.array(z.object({ name: z.string(), url: z.url().optional(), logo: z.string().optional() })),
});

const scheduleSchema = z.array(
  z.object({
    date,
    start: time.optional(),
    end: time.optional(),
    kind: z.enum(['experience', 'event']).default('experience'),
    place: z.string(),
    title: localized.optional(),
    deadline: date.optional(),
    note: localized.optional(),
    status: z.enum(['scheduled', 'cancelled', 'full']).default('scheduled'),
  }),
);

function load<T extends z.ZodType>(file: string, raw: string, schema: T): z.infer<T> {
  const result = schema.safeParse(parse(raw));
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`src/data/${file} の内容に誤りがあります:\n${issues}`);
  }
  return result.data;
}

export const site = load('site.yaml', siteRaw, siteSchema);
export type Site = typeof site;
export type Place = Site['places'][number];

const schedule = load('schedule.yaml', scheduleRaw, scheduleSchema);
export type ScheduleItem = (typeof schedule)[number] & { deadline: string };

for (const item of schedule) {
  if (!site.places.some((p) => p.id === item.place)) {
    throw new Error(`src/data/schedule.yaml: ${item.date} の place "${item.place}" が site.yaml の places にありません`);
  }
}

export function getPlace(id: string): Place {
  return site.places.find((p) => p.id === id)!;
}

/** 今日の日付（日本時間, YYYY-MM-DD） */
export function todayInTokyo(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 今日以降の日程（日付順） */
export function upcomingSchedule(): ScheduleItem[] {
  const today = todayInTokyo();
  return schedule
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({ ...s, deadline: s.deadline ?? addDays(s.date, -2) }));
}
