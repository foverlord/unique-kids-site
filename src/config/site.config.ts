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
  logo: '/logo.svg',
  defaultLocale: 'ru',
  colors: {
    bg: '#FBF6EC', bgAlt: '#F3EADA', surface: '#FFFDF8', ink: '#2B2620', inkMuted: '#6B6358',
    line: '#D9CCB8', accent: '#25D366', accentInk: '#2B2620', rating: '#B8860B',
    pink: '#F4B6C2', pinkD: '#E07A93', yellow: '#F6D365', yellowD: '#E0A91C',
    mint: '#A8DCC5', mintD: '#4FAE8A', blue: '#A9CFEF', blueD: '#5B9BD5', chalk: '#FCEFC7',
  },
  fonts: { heading: 'Nunito', body: 'Golos Text' },
  nav: [
    { href: '#programmy', labelKey: 'nav.programs' },
    { href: '#foto', labelKey: 'nav.photos' },
    { href: '#otzyvy', labelKey: 'nav.reviews' },
    { href: '#kontakty', labelKey: 'nav.contacts' },
  ],
  trustBar: [
    { icon: 'star', labelKey: 'trust.rating' },
    { icon: 'clock', labelKey: 'trust.hours' },
    { icon: 'pin', labelKey: 'trust.address' },
  ],
  hero: { photo: 'classes/class-wooden-blocks.webp', photoCapKey: 'gal.blocks' },
  about: {},
  // Возраст центра 3–7 (Instagram, со слов Амира; DECISIONS.md 13.11). Возраст каждой программы — TODO, уточнить у центра.
  ageBuckets: [
    { id: 'all', labelKey: 'ages.all', ageFrom: 0, ageTo: 18, programIds: [] },
    { id: '3-5', labelKey: 'ages.3_5', ageFrom: 3, ageTo: 5, programIds: ['logoped', 'sport'] },
    { id: '5-7', labelKey: 'ages.5_7', ageFrom: 5, ageTo: 7, programIds: ['logoped', 'sport', 'school', 'mental', 'speedread', 'robotics'] },
  ],
  // Направления — из карточки 2ГИС (+ подготовка к школе из отзывов). Цены нет → «узнать в WhatsApp».
  programs: [
    { id: 'logoped', slug: 'logoped', titleKey: 'programs.logoped.title', summaryKey: 'programs.todo', ageFrom: 3, ageTo: 7, spot: 'speech.svg' },
    { id: 'sport', slug: 'kluby', titleKey: 'programs.sport.title', summaryKey: 'programs.todo', ageFrom: 3, ageTo: 7, spot: 'club.svg' },
    { id: 'school', slug: 'podgotovka-k-shkole', titleKey: 'programs.school.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 7, spot: 'book.svg' },
    { id: 'mental', slug: 'mentalnaya-arifmetika', titleKey: 'programs.mental.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 7, spot: 'abacus.svg' },
    { id: 'speedread', slug: 'skorochtenie', titleKey: 'programs.speedread.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 7, spot: 'book.svg' },
    { id: 'robotics', slug: 'robototehnika', titleKey: 'programs.robotics.title', summaryKey: 'programs.todo', ageFrom: 5, ageTo: 7, spot: 'robot.svg' },
    // только во «Все»: в отзыве — третьеклассник; нужна ли продлёнка, Амир уточнит у директора
    { id: 'afterschool', slug: 'prodlyonka', titleKey: 'programs.afterschool.title', summaryKey: 'programs.afterschool.summary', ageFrom: 7, ageTo: 10, ageKey: 'programs.ageSchool', spot: 'house.svg' },
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
  // TODO (блокер запуска): фото детей с 2ГИС — только для демо, с разрешения Амира. До запуска заменить на снимки с письменным согласием родителей.
  // Раскладка по направлениям условная (TODO). Пустые направления скрыты.
  gallery: [
    { id: 'kluby', titleKey: 'gal.cat.kluby', videos: [], photos: [
      { src: 'classes/class-drawing-sun-pictures.webp', capKey: 'gal.sun' },
      { src: 'classes/class-painting-tote-bags.webp', capKey: 'gal.totesKids' },
      { src: 'classes/class-painting-strawberry-tote.webp', capKey: 'gal.strawberry' },
      { src: 'classes/class-paper-crafts-tables.webp', capKey: 'gal.paper' },
      { src: 'gallery/crafts-paper-rainbows.jpg', capKey: 'gal.rainbows' },
      { src: 'gallery/crafts-painted-tote-bags.jpg', capKey: 'gal.totes' },
    ] },
    { id: 'shkola', titleKey: 'gal.cat.shkola', videos: [], photos: [
      { src: 'classes/class-reading-book.webp', capKey: 'gal.reading' },
      { src: 'classes/class-wooden-blocks.webp', capKey: 'gal.blocks' },
    ] },
    { id: 'prodlenka', titleKey: 'programs.afterschool.title', photos: [], videos: [] },
    { id: 'skorochtenie', titleKey: 'programs.speedread.title', photos: [], videos: [] },
    { id: 'arifmetika', titleKey: 'programs.mental.title', photos: [], videos: [] },
    { id: 'robototehnika', titleKey: 'programs.robotics.title', photos: [], videos: [] },
  ],
  priceGroups: [],
  trial: { enabled: true },
  seo: { titleKey: 'seo.title', descriptionKey: 'seo.description', ogImage: '/og.png', noindex: true },
  demoNote: true,
};
