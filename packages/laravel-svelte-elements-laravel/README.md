# dobrys/laravel-svelte-elements

PHP-жилата за [`laravel-svelte-elements`](../laravel-svelte-elements) (npm пакет).
Сама по себе си не компилира нищо — само:

- сервира `GET /translations/{locale}.json` директно от `lang/{locale}.json`
  (стандартните Laravel JSON преводи, без отделен custom loader);
- publish-ва готови stub-ове (`vite.config.js` snippet + `svelte-all.js`),
  за да не се пишат ръчно всеки път.

## Инсталация

```bash
composer require dobrys/laravel-svelte-elements
npm install laravel-svelte-elements
```

```bash
php artisan vendor:publish --tag=svelte-elements-stubs
```

## Конфигурация

`config/svelte-elements.php`:

```php
return [
    'translations_uri' => '/translations/{locale}.json',
    'middleware' => [], // напр. ['web'] ако имаш нужда от session/cookie контекст
];
```

## Локал в браузъра

Пакетът не инжектира `window.appLocale` автоматично — в главния layout:

```blade
<script>window.appLocale = @json(app()->getLocale());</script>
```

(или собствена Blade директива/компонент в консуматора, ако предпочиташ).
