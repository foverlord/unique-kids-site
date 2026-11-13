# Unique Kids — сайт детского центра (шаблон)

Astro + TypeScript + Tailwind, статический сайт. Без Lenis/GSAP/Lottie: рисунки — SVG с CSS-дорисовкой. JS ≈ 2 КБ gzip.

## Запуск
    npm install
    npm run dev      # http://localhost:4321
    npm run build    # astro check + сборка в dist/

## Деплой превью (Cloudflare Workers, static assets)
    CLOUDFLARE_ACCOUNT_ID=<id> npx wrangler deploy   # → unique-kids.a-a-studio.workers.dev
Пока `seo.noindex: true` в конфиге — сайт закрыт от поисковиков.

## Где что лежит
- `src/config/site.config.ts` — все факты центра: контакты, рейтинг, цвета, шрифты, меню, программы, педагоги, отзывы, галерея.
- `src/config/types.ts` — схема конфига.
- `src/i18n/ru.ts`, `src/i18n/kk.ts` — тексты. kk без ключа = показываем ru. Непроверенные факты начинаются с `TODO:`.
- `src/components/` — блоки главной (§6 ТЗ). Пустой массив в конфиге = блок скрыт.
- `src/components/HeroDrawing.astro` — рисунок героя (заменить SVG Арта; путям дать `class="draw" pathLength="1"`).

## Рескин под другой центр (вечер)
1. Ветка `center/<id>`.
2. Поменять `site.config.ts` (имя, адрес, телефон, WhatsApp, 2ГИС, рейтинг, цвета, шрифты, программы…).
3. Поменять тексты в `ru.ts` / `kk.ts`.
4. Заменить фото, favicon, og-картинку в `public/` и `src/assets/`.
5. Проверить контраст нового акцента (белый текст на кнопке ≥ 4.5:1).
6. `npm run build`, открыть на телефоне: герой, фильтр возраста, WhatsApp-текст, ҚАЗ.
Компоненты не трогать: не хватает поля — добавить его в `types.ts`.
