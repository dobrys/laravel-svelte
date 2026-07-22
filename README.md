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

## Локално тестване в консуматор проект (преди публикуване в npm/Packagist)

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

## Следващи стъпки (не са направени още)

- [ ] Решение дали да се публикуват публично (npm/Packagist) или остават
      частни (private registry / VCS repository).
- [ ] LICENSE файлове (README-тата споменават MIT, но липсва самият файл).
