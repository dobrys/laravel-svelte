# laravel-svelte

Два свързани пакета за качване на Svelte компоненти като нативни Custom
Elements в Laravel (Blade/Livewire) проекти.

```
packages/
├── laravel-svelte-elements/          npm пакет — Vite plugin + runtime loader
└── laravel-svelte-elements-laravel/  composer пакет — translations route + publish stubs
```

Композер не може да тегли npm зависимост — двата пакета се инсталират
отделно и се координират само през версии/документация, не автоматично.

## Инсталация (публикувани пакети)

```bash
npm install laravel-svelte-elements
composer require dobrys/laravel-svelte-elements
```

- npm: [`laravel-svelte-elements`](https://www.npmjs.com/package/laravel-svelte-elements)
- Packagist: [`dobrys/laravel-svelte-elements`](https://packagist.org/packages/dobrys/laravel-svelte-elements)
  — source за composer пакета е разделен (`git subtree split`) в отделно repo
  [`dobrys/svelte-elements-for-laravel`](https://github.com/dobrys/svelte-elements-for-laravel),
  защото Packagist изисква `composer.json` в root-а на репото, а не в
  поддиректория на монорепо. Виж "Публикуване на нова версия" по-долу.

## Локално тестване в консуматор проект (при разработка на пакетите)

**npm пакет** — през `npm link` или директен `file:` път в `package.json`:

```bash
cd packages/laravel-svelte-elements && npm link
cd /path/to/consumer-app && npm link laravel-svelte-elements
```

или в `package.json` на консуматора:

```json
"dependencies": {
  "laravel-svelte-elements": "file:../laravel-svelte/packages/laravel-svelte-elements"
}
```

**composer пакет** — path repository в `composer.json` на консуматора:

```json
{
  "repositories": [
    { "type": "path", "url": "../laravel-svelte/packages/laravel-svelte-elements-laravel" }
  ],
  "require": {
    "dobrys/laravel-svelte-elements": "@dev"
  }
}
```

## Разлики спрямо оригиналния (project-specific) код

- Нищо не е хардкоднато на `resources/js/components` — конфигурируемо през
  опции на `svelteElements()` / `createLoader()`.
- Registry-то се регенерира автоматично при `vite`/`vite build` (Vite plugin
  hook), не изисква отделна `npm run generate-registry` стъпка.
- Преводите вече не минават през custom `translation.js` fetch логика —
  composer пакетът сервира директно `lang/{locale}.json`, JS страната само
  извиква подадения `translationsUrl`.

## Публикуване на нова версия

**npm** — от `packages/laravel-svelte-elements/`:

```bash
npm version patch   # или minor/major — вдига version в package.json + git tag локално
npm publish          # изисква npm login/OTP; виж "Access Tokens" в npmjs.com за bypass-2FA токен
```

**composer** — `packages/laravel-svelte-elements-laravel/` в монорепото е dev копие;
публикуваният source е отделно repo (`svelte-elements-for-laravel`), синхронизирано
чрез git remote `svelte-elements-for-laravel`, добавен в това repo:

```bash
git subtree push --prefix=packages/laravel-svelte-elements-laravel svelte-elements-for-laravel main
cd /path/to/clone/на/svelte-elements-for-laravel   # или клонирай наново
git tag vX.Y.Z && git push --tags
```

Packagist-webhook-ът на `svelte-elements-for-laravel` обновява пакета
автоматично при нов push/tag — не изисква ръчен "Update" на packagist.org.
