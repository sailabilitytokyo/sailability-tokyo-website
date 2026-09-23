// Markdown で書くコンテンツの定義。
// frontmatter（ファイル先頭の --- で囲まれた部分）の項目が足りない・形式が違う場合はビルドが失敗する。
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// タグ: 「1回15〜20分」のような短い特徴。アイコン付きにする場合は { label, icon }（icon は src/icons/ のファイル名）
const tag = z.union([z.string(), z.object({ label: z.string(), icon: z.string().optional() })]);
const link = z.object({ label: z.string(), href: z.string() });

// 固定ページ: src/content/pages/<言語>/<ページ名>.md → /<ページ名>（日本語）, /<言語>/<ページ名>（その他）
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // メニューに表示する短い名前（省略時は title）
      navLabel: z.string().optional(),
      // 検索結果・SNS共有時の説明文（120字程度まで）
      description: z.string(),
      // トップページの紹介カードに出す文（省略時は description）
      summary: z.string().optional(),
      // ページ上部: 英字の小見出し（例: Membership）、タイトル下の文（省略時は summary / description）、特徴タグ
      eyebrow: z.string().optional(),
      lead: z.string().optional(),
      tags: z.array(tag).default([]),
      // ページ上部の写真とその説明（alt）
      image: image().optional(),
      imageAlt: z.string().optional(),
      // ページ本文の後ろに体験会の日程表を表示する
      showSchedule: z.boolean().default(false),
      // 申込ボタン（募集していない時期は cta ごと消すかコメントアウトする）
      cta: z
        .object({
          label: z.string(),
          href: z.url(),
          // Google Analytics に送るイベント名（例: reserve_experience）
          event: z.string().regex(/^[a-z0-9_]+$/),
          // ボタンの上に出す一言（募集終了のお知らせなど）
          note: z.string().optional(),
        })
        .optional(),

      // ── ここから下はトップページ（home.md）専用 ──
      hero: z
        .object({
          badge: z.string().optional(),
          title: z.string(),
          lead: z.string(),
          tags: z.array(tag).default([]),
          primary: link,
          secondary: link.optional(),
          // 背景の写真と、右側に重ねる写真
          background: image().optional(),
          backgroundAlt: z.string().optional(),
          photo: image().optional(),
          photoAlt: z.string().optional(),
        })
        .optional(),
      highlights: z
        .object({
          eyebrow: z.string().optional(),
          title: z.string(),
          lead: z.string().optional(),
          items: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })),
        })
        .optional(),
      intro: z
        .object({
          eyebrow: z.string().optional(),
          title: z.string(),
          link: link.optional(),
          photo: image().optional(),
          photoAlt: z.string().optional(),
        })
        .optional(),
      membership: z
        .object({
          eyebrow: z.string().optional(),
          title: z.string(),
          text: z.string(),
          points: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
          link: link,
        })
        .optional(),
    }),
});

// お知らせ: src/content/news/<言語>/<YYYY-MM-DD-英数字>.md → /news/<ファイル名>
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      // true にすると公開されない（下書き）
      draft: z.boolean().default(false),
    }),
});

export const collections = { pages, news };
