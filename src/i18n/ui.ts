import { DEFAULT_LOCALE, type Locale } from './locales';

// 画面の固定文言（ボタン名・見出しなど）。
// 未翻訳のキーは日本語にフォールバックする。言語を追加するときはここに訳を足す。
const ja = {
  'site.skipToContent': '本文へスキップ',
  'nav.menu': 'メニュー',
  'nav.home': 'ホーム',
  'nav.news': 'お知らせ',
  'header.cta': '体験会の予約',
  'common.more': '詳しく見る',
  'schedule.eyebrow': 'Schedule',
  'schedule.heading': '開催日',
  'schedule.lead': '天候によって中止する場合があります。中止の場合はお知らせでご案内します。',
  'schedule.empty': '現在ご案内できる開催日はありません。決まり次第お知らせでご案内します。',
  'schedule.deadline': '申込締切',
  'schedule.reserve': '予約する（Googleフォーム）',
  'schedule.open': '受付中',
  'schedule.event': 'イベント',
  'schedule.cancelled': '中止',
  'schedule.full': '満員',
  'sticky.next': '次の開催日',
  'sticky.dates': '開催日を見る',
  'sticky.reserve': '予約する',
  'programs.eyebrow': 'Programs',
  'programs.heading': '活動のご案内',
  'news.eyebrow': 'News',
  'news.heading': 'お知らせ',
  'news.description': 'セイラビリティ東京からのお知らせ・セーリング体験会やイベントのご案内',
  'news.new': 'NEW',
  'news.more': 'お知らせ一覧へ',
  'news.archive': '2026年8月以前のお知らせ（旧ブログ）',
  'news.backToList': 'お知らせ一覧に戻る',
  'sponsors.eyebrow': 'Partners & Sponsors',
  'sponsors.heading': 'パートナー・スポンサー',
  'footer.programs': 'Programs',
  'footer.about': 'About',
  'footer.contact': 'Contact',
  'footer.founded': '2013年設立',
  'footer.privacy': 'プライバシーポリシー',
  'lang.label': 'Language',
  'notFound.title': 'ページが見つかりません',
  'notFound.body': 'お探しのページは移動または削除された可能性があります。',
  'notFound.home': 'トップページへ',
} as const;

export type UiKey = keyof typeof ja;

const dictionaries: Partial<Record<Locale, Partial<Record<UiKey, string>>>> = {
  ja,
  en: {},
  'zh-hans': {},
  'zh-hant': {},
};

export function useTranslations(lang: Locale) {
  return (key: UiKey): string => dictionaries[lang]?.[key] ?? dictionaries[DEFAULT_LOCALE]![key]!;
}
