# laravel-svelte-elements

Vite plugin + runtime loader за качване на Svelte компоненти като нативни
Custom Elements в Laravel (Blade/Livewire) проекти — без ръчно свързване на
всеки компонент към конкретна страница.

Companion Composer пакет: [`dobrys/laravel-svelte-elements`](../laravel-svelte-elements-laravel)
(сервира `/translations/{locale}.json` от `lang/*.json` и publish-ва stub-ове).

## Инсталация

```bash
npm install laravel-svelte-elements
```

## `vite.config.js`

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelteElements } from 'laravel-svelte-elements/vite-plugin';

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/js/app.js', 'resources/js/svelte-all.js'] }),
    ...svelteElements({ componentsDir: 'resources/js/components' }),
  ],
});
```

## `resources/js/svelte-all.js`

```js
import { createLoader } from 'laravel-svelte-elements';
import { registry } from './component-registry.js';

createLoader({
  registry,
  localeGlobal: 'appLocale',
  translationsUrl: (locale) => `/translations/${locale}.json`,
}).start();
```

Включи веднъж, глобално, в главния layout:

```blade
@vite(['resources/js/svelte-all.js'])
```

## Компонент

Всеки `.svelte` файл декларира тага си сам — registry-то се генерира
автоматично при `vite`/`vite build` (виж `registryPlugin`):

```svelte
<svelte:options customElement={{ tag: 'my-widget' }} />
```

После в Blade/Livewire изгледа:

```blade
<my-widget some-prop="value"></my-widget>
```

Компонентът се зарежда лениво — при първоначален DOM scan или чрез
`MutationObserver`, ако е добавен динамично (Livewire re-render, модал).
