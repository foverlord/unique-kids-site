import { site } from '../config/site.config';
import { t } from '../i18n';
import type { Locale } from '../config/types';

export function waText(locale: Locale, program?: string, parent?: string, child?: string): string {
  return [
    t('wa.greeting', { name: site.name }, locale),
    t('wa.parent', { v: parent ?? '' }, locale),
    t('wa.child', { v: child ?? '' }, locale),
    t('wa.program', { v: program || t('wa.programAsk', undefined, locale) }, locale),
  ].join('\n');
}

export function waUrl(locale: Locale, program?: string, parent?: string, child?: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(waText(locale, program, parent, child))}`;
}
