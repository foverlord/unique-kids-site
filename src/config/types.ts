export type Locale = 'ru' | 'kk';
export type NavItem = { href: string; labelKey: string };
export type AgeBucket = { id: string; labelKey: string; ageFrom: number; ageTo: number; programIds: string[] };
export type Program = {
  /** цвет плашки и скотча (v4, art/v4/SPEC.md §2) */ tone?: string; tape?: string;
  id: string; slug: string; titleKey: string; summaryKey: string;
  ageFrom: number; ageTo: number;
  /** свой текст возраста вместо «от–до» (например, TODO) */ ageKey?: string; /** файл в public/spots/ */ spot?: string;
  priceLabelKey?: string; durationKey?: string; scheduleKey?: string; image?: string;
};
export type Teacher = { id: string; name: string; ini?: string; by?: string; lang?: 'kk'; roleKey?: string; bioKey: string; photo?: string; programIds?: string[] };
export type Review = { id: string; quoteKey: string; author: string; childAge?: string; date?: string; lang?: 'kk'; source: '2gis' | 'instagram' | 'other' };
export type GalleryPhoto = { /** путь от src/assets/images/ */ src: string; capKey: string };
export type GalleryVideo = { /** путь от public/ */ src: string; poster: string; labelKey: string };
/** Направление в блоке «Что мы делаем»: без фото не показывается; кнопка «ещё N» — при >3 фото. */
export type GalleryCategory = { id: string; titleKey: string; photos: GalleryPhoto[]; videos: GalleryVideo[] };
export type TrustItem = { icon: 'star' | 'pin' | 'group' | 'heart' | 'clock'; labelKey: string };
export type PriceGroup = { id: string; titleKey: string; priceKey: string; noteKey?: string };
export type Colors = {
  bg: string; bgAlt: string; surface: string; ink: string; inkMuted: string;
  line: string; accent: string; accentInk: string; rating: string;
  /** пастели: заливки и засечки ростомера; *D — только обводки */
  pink: string; pinkD: string; yellow: string; yellowD: string; mint: string; mintD: string; blue: string; blueD: string; chalk: string;
};
export type SiteConfig = {
  id: string; name: string; legalName?: string; city: string; address: string; addressNote?: string;
  phoneDisplay: string; phoneE164: string; whatsappNumber: string;
  instagram?: string; email?: string; hoursKey?: string;
  mapUrl: string; mapEmbed?: string; coordinates?: { lat: number; lng: number };
  rating?: { value: number; count: number; source: '2gis'; url: string; asOf: string };
  logo?: string; defaultLocale: Locale; colors: Colors; fonts: { heading: string; body: string };
  nav: NavItem[]; trustBar: TrustItem[];
  hero: { /** три фото в рамках (v4), путь от src/assets/images/ */ photos?: { file: string; altKey: string; pos: string }[] };
  about: { image?: string };
  /** «Как нас найти»: фото входа, путь от src/assets/images/ */ find?: { photo: string; capKey: string; map?: string; routeUrl?: string };
  ageBuckets: AgeBucket[]; defaultAgeBucket?: string;
  programs: Program[]; teachers: Teacher[]; reviews: Review[]; gallery: GalleryCategory[];
  priceGroups: PriceGroup[];
  /** «Что входит» вместо прайса */ includes: { key: string; icon: 'food' | 'pickup' | 'homework' | 'bus' | 'qr' | 'ramp' }[];
  /** «Обычный день» */ daySteps: string[];
  trial: { enabled: boolean };
  seo: { titleKey: string; descriptionKey: string; ogImage?: string; noindex: boolean };
  demoNote: boolean;
};
