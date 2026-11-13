type Dict = Record<string, string>;
type Data = { dicts: { ru: Dict; kk: Dict }; wa: string; name: string; programs: Record<string, string>; def: 'ru' | 'kk' };
const data: Data = JSON.parse(document.getElementById('uk-i18n')!.textContent || '{}');
const $$ = <T extends Element>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const isDev = location.hostname === 'localhost';

/* ---------- аналитика: одно событие, без счётчиков (подключить Plausible/CF позже) ---------- */
function track(name: string, params: Record<string, string | undefined>) {
  const w = window as any;
  (w.ukEvents = w.ukEvents || []).push({ name, ...params });
  if (typeof w.plausible === 'function') w.plausible(name, { props: params });
}

/* ---------- i18n ---------- */
let locale: 'ru' | 'kk' = document.documentElement.lang === 'kk' ? 'kk' : 'ru';
function fill(s: string, v?: Record<string, string>) { return v ? s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)) : s; }
function tr(key: string, v?: Record<string, string>) {
  const s = (locale === 'kk' ? data.dicts.kk[key] : undefined) ?? data.dicts.ru[key];
  if (s === undefined) { if (isDev) console.warn('[i18n] missing', key); return ''; }
  if (locale === 'kk' && data.dicts.kk[key] === undefined && isDev) console.warn('[i18n] kk fallback', key);
  return fill(s, v);
}
const varsOf = (el: Element) => { const j = el.getAttribute('data-i18n-vars'); return j ? JSON.parse(j) : undefined; };

function waHref(programId?: string, parent = '', child = '') {
  const prog = programId && data.programs[programId] ? tr(data.programs[programId]) : '';
  const text = [tr('wa.greeting', { name: data.name }), tr('wa.parent', { v: parent }), tr('wa.child', { v: child }), tr('wa.program', { v: prog || tr('wa.programAsk') })].join('\n');
  return `https://wa.me/${data.wa}?text=${encodeURIComponent(text)}`;
}

function applyLocale() {
  document.documentElement.lang = locale;
  $$('[data-i18n]').forEach((el) => {
    // переменные могут лежать на элементе; для aria-атрибутов — на нём же
    const v = el.hasAttribute('data-i18n-attr') ? undefined : varsOf(el);
    const s = tr(el.getAttribute('data-i18n')!, v);
    if (s) el.textContent = s;
  });
  $$('[data-i18n-attr]').forEach((el) => {
    el.getAttribute('data-i18n-attr')!.split(';').forEach((pair) => {
      const [attr, key] = pair.split('=');
      el.setAttribute(attr, tr(key, varsOf(el)));
    });
  });
  $$<HTMLAnchorElement>('a[data-wa]').forEach((a) => (a.href = waHref(a.dataset.program)));
  $$<HTMLButtonElement>('[data-locale]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.locale === locale)));
}
$$<HTMLButtonElement>('[data-locale]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = b.dataset.locale === 'kk' ? 'kk' : 'ru';
    if (next === locale) return;
    locale = next;
    try { localStorage.setItem('uk-locale', locale); } catch {}
    applyLocale();
    track('locale_change', { locale });
  }),
);
if (locale !== 'ru') applyLocale();

/* ---------- клики WhatsApp / tel ---------- */
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-goal]');
  if (el && el.tagName === 'A') track(el.dataset.goal!, { place: el.dataset.place, programId: el.dataset.program, locale });
});

/* ---------- форма пробного: собираем строку и открываем WhatsApp ---------- */
const form = document.querySelector<HTMLFormElement>('[data-trial-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  track('wa_click', { place: 'trial', locale });
  window.open(waHref(undefined, String(fd.get('parent') || '').trim(), String(fd.get('child') || '').trim()), '_blank', 'noopener');
});

/* ---------- шапка: уплотнение при скролле ---------- */
const hdr = document.querySelector<HTMLElement>('[data-hdr]');
const onScroll = () => hdr?.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- бургер: <dialog> даёт фокус-трап и Escape ---------- */
const drawer = document.querySelector<HTMLDialogElement>('[data-drawer]');
const burger = document.querySelector<HTMLButtonElement>('[data-burger]');
burger?.addEventListener('click', () => drawer?.showModal());
document.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawer?.close());
$$('[data-drawer-link]').forEach((a) => a.addEventListener('click', () => drawer?.close()));
drawer?.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });
drawer?.addEventListener('close', () => burger?.focus());

/* ---------- фильтр программ по возрасту ---------- */
const chips = $$<HTMLButtonElement>('[data-bucket]');
const cards = $$<HTMLElement>('[data-prog]');
const empty = document.querySelector<HTMLElement>('[data-prog-empty]');
const grid = document.querySelector<HTMLElement>('[data-prog-grid]');
function filter(chip: HTMLButtonElement) {
  const ids = chip.dataset.ids!;
  const allow = ids === '*' ? null : new Set(ids.split(',').filter(Boolean));
  if (grid) grid.style.minHeight = grid.offsetHeight + 'px';
  let shown = 0;
  cards.forEach((c) => { const on = !allow || allow.has(c.dataset.prog!); c.hidden = !on; if (on) shown++; });
  if (empty) empty.hidden = shown > 0;
  if (grid) { grid.hidden = shown === 0; requestAnimationFrame(() => (grid.style.minHeight = '')); }
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
}
chips.forEach((c) => c.addEventListener('click', () => filter(c)));

/* ---------- отзывы: scroll-snap + кнопки и точки ---------- */
const track_ = document.querySelector<HTMLElement>('[data-rev-track]');
if (track_) {
  const dots = $$('[data-rev-dots] span');
  const step = () => (track_.firstElementChild as HTMLElement)?.offsetWidth + 16 || track_.clientWidth;
  $$<HTMLButtonElement>('[data-rev]').forEach((b) => b.addEventListener('click', () => track_.scrollBy({ left: Number(b.dataset.rev) * step(), behavior: 'smooth' })));
  track_.addEventListener('scroll', () => { const i = Math.round(track_.scrollLeft / step()); dots.forEach((d, j) => d.classList.toggle('on', i === j)); }, { passive: true });
}

/* ---------- фото по направлениям: вкладки + лайтбокс категории ---------- */
const tabs = $$<HTMLButtonElement>('[data-tab]');
tabs.forEach((b, i) => {
  b.addEventListener('click', () => {
    tabs.forEach((x) => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById('cat-' + x.dataset.tab)!.hidden = !on; });
    track('gallery_tab', { programId: b.dataset.tab });
  });
  b.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click(); } });
});
const lb = document.querySelector<HTMLDialogElement>('[data-lightbox]');
if (lb) {
  const img = lb.querySelector<HTMLImageElement>('[data-lb-img]')!;
  let list: { full: string; key: string }[] = [], cur = 0, opener: HTMLElement | null = null;
  const show = (i: number) => { cur = (i + list.length) % list.length; img.src = list[cur].full; img.alt = tr(list[cur].key); };
  $$<HTMLButtonElement>('[data-gal]').forEach((b) => b.addEventListener('click', () => {
    list = JSON.parse(b.closest<HTMLElement>('[data-photos]')!.dataset.photos!); opener = b;
    show(Number(b.dataset.gal)); lb.showModal(); document.documentElement.classList.add('no-scroll');
  }));
  $$<HTMLButtonElement>('[data-lb]', lb).forEach((b) => b.addEventListener('click', () => show(cur + Number(b.dataset.lb))));
  lb.querySelector('[data-lb-close]')!.addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  lb.addEventListener('close', () => { document.documentElement.classList.remove('no-scroll'); opener?.focus(); });
}

/* ---------- герой: ростомер → фильтр, барс растёт при прокрутке ---------- */
$$<HTMLAnchorElement>('[data-bucket-link]').forEach((a) => a.addEventListener('click', () => {
  const chip = document.querySelector<HTMLButtonElement>(`[data-bucket="${a.dataset.bucketLink}"]`);
  if (chip) filter(chip);
}));
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  let ticking = false;
  const step = () => (matchMedia('(min-width:1024px)').matches ? 80 : 60);
  const upd = () => { ticking = false; hero.dataset.age = String(3 + Math.max(0, Math.min(4, Math.floor(scrollY / step())))); };
  const q = Number(new URLSearchParams(location.search).get('age'));
  if (q >= 3 && q <= 7) hero.dataset.age = String(Math.round(q));
  else {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
}
document.addEventListener('click', (e) => {
  const s = (e.target as Element).closest<HTMLElement>('[data-hop]');
  if (s) { s.classList.remove('hop'); void s.offsetWidth; s.classList.add('hop'); }
});

/* ---------- липкий CTA прячется у блока «Пробное»; дорисовка рисунков при входе в экран ---------- */
const sticky = document.querySelector<HTMLElement>('[data-sticky]');
const trial = document.querySelector('[data-trial]');
if ('IntersectionObserver' in window) {
  if (sticky && trial) new IntersectionObserver(([e]) => sticky.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.2 }).observe(trial);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.25 });
  $$('.drawing').forEach((d) => io.observe(d));
} else $$('.drawing').forEach((d) => d.classList.add('is-in'));
