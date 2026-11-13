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
  whatsappNumber: '77788141932', // 2ГИС: WhatsApp на этом же номере
  // instagram: 'https://instagram.com/unique_kids__', // TODO: профиль не подтверждён — включить после проверки
  hoursKey: 'contacts.hoursValue', // 2ГИС + табличка на двери, 13.11.2026
  mapUrl: 'https://2gis.kz/astana/firm/70000001063764314',
  coordinates: { lat: 51.096367, lng: 71.407931 },
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
    { icon: 'clock', labelKey: 'trust.hours' },
    { icon: 'pin', labelKey: 'trust.address' },
  ],
  hero: { agesKey: 'hero.ages' }, // illustration: Арт
  about: {},
  // TODO: возраст и корзины — догадка для демо (в 2ГИС только стенд 2022: «от 3 до 10 лет»). Уточнить у центра.
  ageBuckets: [
    { id: 'all', labelKey: 'ages.all', ageFrom: 0, ageTo: 18, programIds: [] },
    { id: '3-5', labelKey: 'ages.3_5', ageFrom: 3, ageTo: 5, programIds: ['logoped', 'sport'] },
    { id: '5-7', labelKey: 'ages.5_7', ageFrom: 5, ageTo: 7, programIds: ['logoped', 'speedread', 'mental', 'sport'] },
    { id: '7-10', labelKey: 'ages.7_10', ageFrom: 7, ageTo: 10, programIds: ['afterschool', 'speedread', 'mental', 'robotics', 'sport'] },
  ],
  // Направления — из карточки 2ГИС. Цены нет → «узнать в WhatsApp».
  programs: [
    { id: 'afterschool', slug: 'prodlyonka', titleKey: 'programs.afterschool.title', summaryKey: 'programs.afterschool.summary', ageFrom: 7, ageTo: 10 },
    { id: 'speedread', slug: 'skorochtenie', titleKey: 'programs.speedread.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 10 },
    { id: 'mental', slug: 'mentalnaya-arifmetika', titleKey: 'programs.mental.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 10 },
    { id: 'logoped', slug: 'logoped', titleKey: 'programs.logoped.title', summaryKey: 'programs.todo', ageFrom: 3, ageTo: 7 },
    { id: 'robotics', slug: 'robototehnika', titleKey: 'programs.robotics.title', summaryKey: 'programs.todo', ageFrom: 7, ageTo: 10 },
    { id: 'sport', slug: 'sport-intellekt', titleKey: 'programs.sport.title', summaryKey: 'programs.todo', ageFrom: 3, ageTo: 10 },
  ],
  teachers: [],
  // Дословно с 2ГИС, 13.11.2026 (content/reviews.md)
  reviews: [
    { id: 'r1', quoteKey: 'reviews.r1', author: 'Ляйля Акимжанова', source: '2gis' },
    { id: 'r5', quoteKey: 'reviews.r5', author: 'Санжар Бериков', source: '2gis' },
    { id: 'r4', quoteKey: 'reviews.r4', author: 'Almira Uisen', source: '2gis' },
    { id: 'r6', quoteKey: 'reviews.r6', author: 'А. Бахыт', source: '2gis' },
    { id: 'r2', quoteKey: 'reviews.r2', author: 'Акмарал Базарбеккызы', source: '2gis' },
    { id: 'r3', quoteKey: 'reviews.r3', author: 'Aigerim I', source: '2gis' },
  ],
  // Фото с 2ГИС без лиц детей (content/photos/index.md). Перед запуском заменить на снимки центра.
  gallery: [
    { src: 'facade-sign-day.jpg', altKey: 'gal.facadeDay', type: 'space' },
    { src: 'crafts-paper-rainbows.jpg', altKey: 'gal.rainbows', type: 'art' },
    { src: 'entrance-door-canopy.jpg', altKey: 'gal.door', type: 'space' },
    { src: 'crafts-painted-tote-bags.jpg', altKey: 'gal.totes', type: 'art' },
    { src: 'facade-sign-letters.jpg', altKey: 'gal.letters', type: 'space' },
    { src: 'entrance-night.jpg', altKey: 'gal.night', type: 'space' },
  ],
  priceGroups: [],
  trial: { enabled: true },
  seo: { titleKey: 'seo.title', descriptionKey: 'seo.description', ogImage: '/og-default.jpg', noindex: true },
  demoNote: true,
};
