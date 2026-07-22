# CLAUDE.md

Указания за Claude Code при работа в това repo.

## Какво е това

Монорепо с два свързани, но отделно публикувани пакета, плюс демо Laravel
приложение, което ги консумира и двата.
Vite entry, който компилира Svelte компоненти като нативни Custom Elements,
автоматично генерирана registry-карта (tag → dynamic import) и runtime loader
с lazy-load + `MutationObserver` за динамично добавени тагове (Livewire
re-renders, модали).

```
packages/
├── laravel-svelte-elements/          npm пакет — Vite plugin + runtime loader
└── laravel-svelte-elements-laravel/  composer пакет (dobrys/laravel-svelte-elements)
                                        — Laravel service provider, /translations route, publish stubs
demo/                                  Laravel 13 приложение, линкващо двата пакета
                                        локално (file: path / composer path repo) — служи
                                        като единствен end-to-end тест засега
```

Композер **не** тегли npm зависимост — двата пакета се инсталират отделно в
консуматор проекта и се координират само през версии/документация.

## Ключови файлове

**npm пакет** (`packages/laravel-svelte-elements/`):
- `vite-plugin.js` — `svelteElements(options)`, връща масив Vite plugin-и
  (`@sveltejs/vite-plugin-svelte` с `customElement: true` + registry generator)
- `src/generate-registry.js` — сканира `componentsDir` за `.svelte` файлове с
  `tag: "..."` в `<svelte:options customElement={{ tag: '...' }} />` и пише
  `registryOut` (tag → `() => import(...)`)
- `src/registry-plugin.js` — Vite `buildStart` hook, регенерира registry-то
  автоматично при всеки `vite`/`vite build` (без ръчна npm команда)
- `src/loader.js` — `createLoader(options).start()`: зарежда преводи (ако е
  подаден `translationsUrl`), сканира DOM за регистрирани тагове, наблюдава с
  `MutationObserver` за нови
- `bin/generate-registry.js` — CLI еквивалент за ръчно/CI извикване
- `src/index.js` — browser-safe barrel (само `createLoader` + `__`).
  **Умишлено НЕ реекспортва `generateRegistry`** — тя ползва Node `fs`/`path`
  и се тегли само от `registry-plugin.js`/`bin/generate-registry.js` директно
  от `./generate-registry.js`. Ако добавиш нов export в тази папка, провери
  дали не тегли Node-only модул обратно в `index.js` (виж commit `e18ed91` —
  фиксира точно този leak в browser bundle-а).

**composer пакет** (`packages/laravel-svelte-elements-laravel/`):
- `src/SvelteElementsServiceProvider.php` — регистрира route-а и publishable
  групи (`svelte-elements-config`, `svelte-elements-stubs`)
- `src/Http/Controllers/TranslationsController.php` — сервира JSON директно
  от `lang_path("{locale}.json")` (стандартните Laravel JSON преводи)
- `config/svelte-elements.php` — `translations_uri`, `middleware`
- `resources/stubs/` — `vite.config.stub.js` и `svelte-all.stub.js` за publish

**demo/** (Laravel 13 приложение, служи и като консуматор за ръчно тестване):
- линкнато е през `file:../packages/laravel-svelte-elements` (npm,
  `demo/package.json`) и path repository към
  `../packages/laravel-svelte-elements-laravel` (composer, `demo/composer.json`)
  — вижда промени в пакетите веднага, без publish
- `demo/vite.config.js` — реален пример за wiring:
  `laravel-vite-plugin` + `...svelteElements({ componentsDir: 'resources/js/components' })`
- `demo/resources/js/component-registry.js` — auto-generated (не се редактира
  ръчно), `demo/resources/js/svelte-all.js` — извиква `createLoader()` с
  `translationsUrl` към composer пакета
- `demo/resources/js/components/` — `.svelte` компоненти, всеки декларира тага
  си сам (виж "Конвенции" по-долу); `examples/` са демо компоненти,
  показани на `/svelte-test` (route в `demo/routes/web.php`,
  view `demo/resources/views/svelte-test.blade.php`)

## Команди (в `demo/`)

```bash
composer install && npm install    # инсталира зависимостите (включително линкнатите пакети)
composer run dev                   # php artisan serve + queue:listen + pail + vite (concurrently)
npm run dev                        # само Vite dev server (регенерира registry автоматично)
npm run build                      # production build
composer test                      # php artisan test (PHPUnit/Pest)
```

npm пакетът също излага CLI за ръчна регенерация на registry-то извън Vite:

```bash
npx svelte-elements --components resources/js/components --out resources/js/component-registry.js
```

## Конвенции

- **Нищо не е хардкоднато** на конкретен проект — `componentsDir`,
  `registryOut`, `translationsUrl`, `localeGlobal` са всички опции, не
  константи. Не добавяй project-specific пътища обратно в пакета.
- Всеки Svelte компонент декларира тага си сам:
  `<svelte:options customElement={{ tag: 'my-widget' }} />` — registry-то се
  извлича с regex по този патърн, не с ръчна регистрация.
- Преводите минават през Laravel-ските `lang/*.json`, не през отделен custom
  fetch/loader формат — composer пакетът е единственият източник на истина за
  локализацията.
- И двата пакета остават малки и без runtime зависимост един от друг — само
  документационна връзка (виж root `README.md`).

## Тестване на промени

Няма автоматизирани тестове за пакетите. Проверка на промяна в `packages/`
означава: пусни я през `demo/` (вече линкнато чрез `file:`/path repository —
виж "Команди" по-горе) и провери дали компонентите се зареждат идентично
(`/svelte-test` route). За съвсем нов консуматор проект виж "Локално
тестване" в root `README.md`.

## Публикувани пакети

И двата пакета вече са публично публикувани:
- npm: [`laravel-svelte-elements`](https://www.npmjs.com/package/laravel-svelte-elements)
- Packagist: [`dobrys/laravel-svelte-elements`](https://packagist.org/packages/dobrys/laravel-svelte-elements)

**Важно за composer пакета**: `packages/laravel-svelte-elements-laravel/` в
това монорепо е dev копие. Packagist не поддържа сочене към поддиректория на
repo, затова публикуваният source е отделно repo —
[`dobrys/svelte-elements-for-laravel`](https://github.com/dobrys/svelte-elements-for-laravel)
(извлечено с `git subtree split`, с webhook към Packagist за автоматичен
update). Git remote `svelte-elements-for-laravel` в това repo сочи натам. За
нова версия виж "Публикуване на нова версия" в root `README.md` —
промените в `packages/laravel-svelte-elements-laravel/` трябва изрично да се
push-нат (`git subtree push`) към това отделно repo и да се tag-нат там,
иначе Packagist няма да ги вземе.

npm пакетът (`packages/laravel-svelte-elements/`) няма това ограничение —
публикува се директно от монорепото (`npm publish` вътре в поддиректорията).
