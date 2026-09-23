// 検索エンジン向けの構造化データ（JSON-LD, https://schema.org/）。
// Google 検索で団体情報やイベント日程がリッチに表示されやすくなる。
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { useTranslations } from '../i18n/ui';
import { paren } from './format';
import { getPlace, pick, site, type ScheduleItem } from './data';

export function organizationJsonLd(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    '@id': new URL('/#organization', siteUrl).href,
    name: pick(site.legalName, DEFAULT_LOCALE),
    alternateName: site.name,
    url: siteUrl.href,
    email: site.email,
    foundingDate: String(site.foundedYear),
    sport: 'Sailing',
    slogan: site.tagline,
    description: pick(site.description, DEFAULT_LOCALE),
    sameAs: site.social.map((s) => s.url),
  };
}

export function eventJsonLd(item: ScheduleItem, lang: Locale, siteUrl: URL, pageUrl: string) {
  const place = getPlace(item.place);
  const title =
    pick(item.title, lang) ||
    (item.kind === 'experience' ? `${useTranslations(lang)('schedule.experienceName')}${paren(lang, pick(place.name, lang))}` : site.name);
  const withTime = (t?: string) => (t ? `${item.date}T${t.padStart(5, '0')}:00+09:00` : item.date);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    startDate: withTime(item.start),
    ...(item.end ? { endDate: withTime(item.end) } : {}),
    eventStatus: item.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: pick(place.name, lang),
      address: {
        '@type': 'PostalAddress',
        addressLocality: place.addressLocality,
        addressRegion: place.addressRegion,
        addressCountry: 'JP',
      },
    },
    organizer: { '@id': new URL('/#organization', siteUrl).href, name: site.name, url: siteUrl.href },
    url: new URL(pageUrl, siteUrl).href,
    ...(item.kind === 'experience'
      ? {
          offers: {
            '@type': 'Offer',
            price: site.experience.price,
            priceCurrency: 'JPY',
            url: site.forms.experience,
            availability: item.status === 'full' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            validThrough: `${item.deadline}T23:59:00+09:00`,
          },
        }
      : {}),
  };
}

export function articleJsonLd(opts: { title: string; date: Date; url: string; siteUrl: URL; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    datePublished: opts.date.toISOString(),
    url: new URL(opts.url, opts.siteUrl).href,
    ...(opts.image ? { image: [opts.image] } : {}),
    author: { '@id': new URL('/#organization', opts.siteUrl).href, name: site.name },
    publisher: { '@id': new URL('/#organization', opts.siteUrl).href, name: site.name },
  };
}
