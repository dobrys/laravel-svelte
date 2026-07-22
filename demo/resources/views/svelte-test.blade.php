<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>Svelte Elements Test</title>
    <script>window.appLocale = @json(app()->getLocale());</script>
    @vite(['resources/css/app.css', 'resources/js/svelte-all.js'])
</head>
<body style="font-family: sans-serif; padding: 2rem;">
    <h1>laravel-svelte-elements — тестова страница</h1>
    <p>Компоненти от <code>resources/js/components/</code> се зареждат тук автоматично.</p>

    <svelte-hello-widget></svelte-hello-widget>

    <p style="margin-top:2rem; color:#666;">
        Добавен динамично (5s delay) — проверява MutationObserver пътя:
    </p>
    <div id="dynamic-slot"></div>
    <script>
        setTimeout(() => {
            const el = document.createElement('svelte-hello-widget');
            document.getElementById('dynamic-slot').appendChild(el);
        }, 500);
    </script>
</body>
</html>
