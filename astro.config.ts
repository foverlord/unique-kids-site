import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://unique-kids.a-a-studio.workers.dev',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss() as any] },
});
