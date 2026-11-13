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

let selAge = '';
function waHref(programId?: string, parent = '', child = '') {
  const prog = programId && data.programs[programId] ? tr(data.programs[programId]) : '';
  if (selAge && !parent && !child) return `https://wa.me/${data.wa}?text=${encodeURIComponent(tr('wa.withAge', { age: ageLabel(selAge), name: data.name, v: prog || tr('wa.ageAsk') }))}`;
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
  showAge();
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

/* ---------- форма пробного (art/v3 §6.7): тот же префилл, что у карточки возраста ---------- */
const form = document.querySelector<HTMLFormElement>('[data-trial-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const parent = String(fd.get('parent') || '').trim();
  const b = String(fd.get('age') || '');
  const prog = String(fd.get('program') || '');
  const progT = prog && data.programs[prog] ? tr(data.programs[prog]) : tr('wa.ageAsk');
  let text = b ? tr('wa.withAge', { age: ageLabel(b), name: data.name, v: progT }) : [tr('wa.greeting', { name: data.name }), tr('wa.program', { v: progT })].join('\n');
  if (parent) text += '\n' + tr('wa.parent', { v: parent });
  track('wa_click', { place: 'trial', locale });
  window.open(`https://wa.me/${data.wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
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
// возраст: '3'..'7', группа '3-5' | '5-7' | '7plus' или 'school' (ветка)
function ageLabel(a: string) {
  if (a === 'school' || a === '7plus') return '7+';
  if (a === '3-5' || a === '5-7') return tr('age.y', { n: a.replace('-', '–') });
  return tr(a === '3' || a === '4' ? 'age.y34' : 'age.y', { n: a });
}
const RANGE: Record<string, [number, number]> = { '3-5': [3, 4], '5-7': [5, 7], '7plus': [8, 10], school: [8, 10] };
function showAge() {
  const box = document.querySelector<HTMLElement>('[data-age-card]');
  if (!box) return;
  box.hidden = !selAge;
  if (!selAge) return;
  const [a, z] = RANGE[selAge] ?? [Number(selAge), Number(selAge)];
  const school = selAge === 'school' || selAge === '7plus';
  box.style.setProperty('--c', `var(--${school ? 'blue' : a < 5 && z < 5 ? 'pink' : 'mint'})`);
  box.querySelector('[data-ac-title]')!.textContent = school ? tr('programs.forSchool') : tr('programs.forAge', { age: ageLabel(selAge) });
  const ul = box.querySelector('[data-ac-list]')!;
  ul.replaceChildren(...cards.filter((c) => Number(c.dataset.from) <= z && Number(c.dataset.to) >= a).map((c) => {
    const li = document.createElement('li');
    const img = document.createElement('img'); img.src = c.dataset.spot || ''; img.alt = ''; img.width = img.height = 34;
    const n = document.createElement('span'); n.textContent = c.querySelector('h3')?.textContent || '';
    const i = document.createElement('i'); i.textContent = c.querySelector('.age')?.textContent || '';
    li.append(img, n, i); return li;
  }));
  const text = tr('wa.withAge', { age: ageLabel(selAge), name: data.name, v: tr('wa.ageAsk') });
  box.querySelector<HTMLAnchorElement>('[data-ac-wa]')!.href = `https://wa.me/${data.wa}?text=${encodeURIComponent(text)}`;
  box.querySelector('[data-ac-pre]')!.textContent = tr('programs.inMsg', { v: text });
}
function setAge(age: string) {
  selAge = age;
  $$<HTMLAnchorElement>('a[data-wa]').forEach((a) => (a.href = waHref(a.dataset.program)));
  showAge();
}
chips.forEach((c) => c.addEventListener('click', () => { filter(c); setAge(''); }));

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
  const show = (i: number) => { cur = (i + list.length) % list.length; img.hidden = false; img.src = list[cur].full; img.alt = tr(list[cur].key); };
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

/* ---------- герой v3: тап по цифре / полосе / «Школа 7+» — барс идёт туда, карточка и фильтр ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
const BUCKET_OF: Record<string, string> = { '3': '3-5', '4': '3-5', '5': '5-7', '6': '5-7', '7': '5-7', school: '7plus' };
const TICK_OF: Record<string, string> = { '3-5': '3', '5-7': '5', '7plus': 'school' };
function moveCub(state: string) {
  if (!hero) return;
  hero.dataset.age = state;
  $$<HTMLElement>('[data-stage]', hero).forEach((st) => {
    const p = JSON.parse(st.dataset.pos!)[state]; const w = JSON.parse(st.dataset.walk!);
    if (!p) return;
    const [cx, cy, dx, pose, c] = p;
    const cub = st.querySelector<HTMLElement>('.st-cubs')!;
    cub.style.setProperty('--cx', cx); cub.style.setProperty('--cy', cy); cub.dataset.pose = String(pose);
    const dot = st.querySelector<SVGElement>('.st-dot')!;
    dot.style.setProperty('--dx', dx); dot.style.fill = `var(--${c})`; dot.style.opacity = state === 'school' ? '0' : '1';
    const walk = st.querySelector('.walk')!;
    walk.setAttribute('d', state === 'school' ? w.school : `M${w.tx[0]} ${w.y} L${w.tx[Number(state) - 3]} ${w.y}`);
    walk.setAttribute('stroke', `var(--${c}-d)`);
    $$<HTMLElement>('[data-set-age]', st).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setAge === state)));
  });
}
function pickAge(state: string, label: string) {
  moveCub(state);
  const chip = document.querySelector<HTMLButtonElement>(`[data-bucket="${BUCKET_OF[state]}"]`);
  if (chip) filter(chip);
  setAge(label);
  document.querySelector('[data-age-card]')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  track('age_pick', { place: label, locale });
}
$$<HTMLButtonElement>('[data-set-age]').forEach((b) => b.addEventListener('click', () => pickAge(b.dataset.setAge!, b.dataset.setAge!)));
$$<HTMLButtonElement>('[data-set-band]').forEach((b) => b.addEventListener('click', () => pickAge(TICK_OF[b.dataset.setBand!], b.dataset.setBand!)));
{
  const q = new URLSearchParams(location.search).get('age');
  if (q && (q === 'school' || (Number(q) >= 3 && Number(q) <= 7))) moveCub(q);
  else moveCub('3');
}
document.addEventListener('click', (e) => {
  const s = (e.target as Element).closest<HTMLElement>('[data-hop]');
  if (s) { s.classList.remove('hop'); void s.offsetWidth; s.classList.add('hop'); }
});

/* ---------- липкий CTA прячется у блока «Пробное»; дорисовка рисунков при входе в экран ---------- */
const sticky = document.querySelector<HTMLElement>('[data-sticky]');
const trial = document.querySelector('[data-trial]');
if ('IntersectionObserver' in window) {
  // липкая панель — только когда кнопка героя (#cta) ушла с экрана и не виден блок «Пробное» (art/v3 §2)
  const vis = new Map<Element, boolean>();
  const cta = document.getElementById('cta');
  const sio = new IntersectionObserver((es) => { es.forEach((e) => vis.set(e.target, e.isIntersecting)); sticky?.classList.toggle('is-hidden', [...vis.values()].some(Boolean)); }, { threshold: 0.2 });
  if (sticky) { if (cta) { vis.set(cta, true); sticky.classList.add('is-hidden'); sio.observe(cta); } if (trial) sio.observe(trial); }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.25 });
  $$('.drawing').forEach((d) => io.observe(d));
} else $$('.drawing').forEach((d) => d.classList.add('is-in'));
