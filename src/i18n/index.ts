import { ru, type DictKey } from './ru';
import { kk } from './kk';
import type { Locale } from '../config/types';

export type { DictKey };
export const dicts = { ru, kk } as const;

export function fill(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function t(key: DictKey | string, vars?: Record<string, string | number>, locale: Locale = 'ru'): string {
  const k = key as DictKey;
  const raw = (locale === 'kk' ? kk[k] : undefined) ?? ru[k];
  if (raw === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
    return '';
  }
  return fill(raw, vars);
}

/** Ключи, которых нет в kk (для отчёта Критику). */
export const missingKk = (Object.keys(ru) as DictKey[]).filter((k) => !(k in kk));
