import type { SiteConfig } from './types';

// Единственное место с фактами о центре. Рескин = правка этого файла + словарей + ассетов.
export const site: SiteConfig = {
  id: 'unique-kids',
  name: 'Unique Kids',
  city: 'Астана',
  address: 'пр. Кабанбай батыр, 58а, корпус 1',
  addressNote: 'район Есиль',
  phoneDisplay: '+7 778 814-19-32',
  phoneE164: '+77788141932',
  whatsappNumber: '77788141932', // TODO: подтвердить, что WhatsApp на этом же номере
  instagram: 'https://instagram.com/unique_kids__', // TODO: подтвердить
  hoursKey: 'contacts.hoursTodo', // TODO: график
  mapUrl: 'https://2gis.kz/astana/firm/70000001063764314',
  rating: { value: 5.0, count: 104, source: '2gis', url: 'https://2gis.kz/astana/firm/70000001063764314', asOf: '2026-11-13' },
  defaultLocale: 'ru',
  colors: {
    bg: '#F6F1E8', bgAlt: '#EFE7D8', surface: '#FFFCF7', ink: '#2B2620', inkMuted: '#6B6358',
    line: '#C8BBA8', accent: '#B5501E', accentInk: '#FFFFFF', rating: '#B8860B',
  },
  fonts: { heading: 'Nunito', body: 'Golos Text' },
  nav: [
    { href: '#programmy', labelKey: 'nav.programs' },
    { href: '#pedagogi', labelKey: 'nav.teachers' },
    { href: '#ceny', labelKey: 'nav.prices' },
    { href: '#otzyvy', labelKey: 'nav.reviews' },
    { href: '#kontakty', labelKey: 'nav.contacts' },
  ],
  trustBar: [
    { icon: 'star', labelKey: 'trust.rating' },
    { icon: 'group', labelKey: 'trust.groups' }, // TODO: подтвердить мини-группы
    { icon: 'pin', labelKey: 'trust.address' },
  ],
  hero: { agesKey: 'hero.ages' }, // illustration: Арт
  about: {},
  ageBuckets: [
    { id: 'all', labelKey: 'ages.all', ageFrom: 0, ageTo: 18, programIds: [] },
    { id: '1-3', labelKey: 'ages.1_3', ageFrom: 1, ageTo: 3, programIds: ['early'] },
    { id: '3-5', labelKey: 'ages.3_5', ageFrom: 3, ageTo: 5, programIds: ['early', 'creative'] },
    { id: '5-7', labelKey: 'ages.5_7', ageFrom: 5, ageTo: 7, programIds: ['school', 'creative'] },
    { id: '7+', labelKey: 'ages.7p', ageFrom: 7, ageTo: 18, programIds: [] },
  ], // TODO: корзины уточнить у центра
  programs: [
    { id: 'early', slug: 'rannee-razvitie', titleKey: 'programs.early.title', summaryKey: 'programs.early.summary', ageFrom: 1, ageTo: 5 },
    { id: 'school', slug: 'podgotovka-k-shkole', titleKey: 'programs.school.title', summaryKey: 'programs.school.summary', ageFrom: 5, ageTo: 7 },
    { id: 'creative', slug: 'tvorchestvo', titleKey: 'programs.creative.title', summaryKey: 'programs.creative.summary', ageFrom: 3, ageTo: 7 },
  ], // TODO: реальные программы, возраст, цены
  teachers: [],
  reviews: [],
  gallery: [],
  priceGroups: [],
  trial: { enabled: true },
  seo: { titleKey: 'seo.title', descriptionKey: 'seo.description', ogImage: '/og-default.jpg', noindex: true },
  demoNote: true,
};
