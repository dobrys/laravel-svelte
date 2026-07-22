# CLAUDE.md

Указания за Claude Code при работа в това repo.

## Какво е това

Монорепо с два свързани, но отделно публикувани пакета, извлечени от
Svelte-в-Laravel механизма на проекта `html-laravel-vite-full-version`:
Vite entry, който компилира Svelte компоненти като нативни Custom Elements,
автоматично генерирана registry-карта (tag → dynamic import) и runtime loader
с lazy-load + `MutationObserver` за динамично добавени тагове (Livewire
re-renders, модали).

```
packages/
├── laravel-svelte-elements/          npm пакет — Vite plugin + runtime loader
└── laravel-svelte-elements-laravel/  composer пакет (dobrys/laravel-svelte-elements)
                                        — Laravel service provider, /translations route, publish stubs
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

**composer пакет** (`packages/laravel-svelte-elements-laravel/`):
- `src/SvelteElementsServiceProvider.php` — регистрира route-а и publishable
  групи (`svelte-elements-config`, `svelte-elements-stubs`)
- `src/Http/Controllers/TranslationsController.php` — сервира JSON директно
  от `lang_path("{locale}.json")` (стандартните Laravel JSON преводи)
- `config/svelte-elements.php` — `translations_uri`, `middleware`
- `resources/stubs/` — `vite.config.stub.js` и `svelte-all.stub.js` за publish

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

Няма автоматизирани тестове все още. Проверка на промяна означава: linkни
пакета в реален консуматор (виж "Локално тестване" в root `README.md` —
`npm link` / `file:` за npm, path-repository за composer) и провери дали
компонентите се зареждат идентично.

## Какво не е готово

Виж чек-листа в root `README.md` ("Следващи стъпки") — най-важното: няма
реален end-to-end тест в консуматор проект, няма решение за публично
публикуване (npm/Packagist) vs. частен registry.
