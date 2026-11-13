export type Locale = 'ru' | 'kk';
export type NavItem = { href: string; labelKey: string };
export type AgeBucket = { id: string; labelKey: string; ageFrom: number; ageTo: number; programIds: string[] };
export type Program = {
  id: string; slug: string; titleKey: string; summaryKey: string;
  ageFrom: number; ageTo: number;
  priceLabelKey?: string; durationKey?: string; scheduleKey?: string; image?: string;
};
export type Teacher = { id: string; name: string; roleKey: string; bioKey: string; photo?: string; programIds?: string[] };
export type Review = { id: string; quoteKey: string; author: string; childAge?: string; source: '2gis' | 'instagram' | 'other' };
export type GalleryItem = { /** файл в src/assets/images/gallery/ */ src: string; altKey: string; type: 'space' | 'activity' | 'art' };
export type TrustItem = { icon: 'star' | 'pin' | 'group' | 'heart' | 'clock'; labelKey: string };
export type PriceGroup = { id: string; titleKey: string; priceKey: string; noteKey?: string };
export type Colors = {
  bg: string; bgAlt: string; surface: string; ink: string; inkMuted: string;
  line: string; accent: string; accentInk: string; rating: string;
};
export type SiteConfig = {
  id: string; name: string; legalName?: string; city: string; address: string; addressNote?: string;
  phoneDisplay: string; phoneE164: string; whatsappNumber: string;
  instagram?: string; email?: string; hoursKey?: string;
  mapUrl: string; mapEmbed?: string; coordinates?: { lat: number; lng: number };
  rating?: { value: number; count: number; source: '2gis'; url: string; asOf: string };
  logo?: string; defaultLocale: Locale; colors: Colors; fonts: { heading: string; body: string };
  nav: NavItem[]; trustBar: TrustItem[];
  hero: { image?: string; illustration?: string; agesKey: string };
  about: { image?: string };
  ageBuckets: AgeBucket[]; defaultAgeBucket?: string;
  programs: Program[]; teachers: Teacher[]; reviews: Review[]; gallery: GalleryItem[];
  priceGroups: PriceGroup[];
  trial: { enabled: boolean };
  seo: { titleKey: string; descriptionKey: string; ogImage?: string; noindex: boolean };
  demoNote: boolean;
};
