<?php

namespace Dobrys\SvelteElements;

use Illuminate\Support\ServiceProvider;

class SvelteElementsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/svelte-elements.php', 'svelte-elements');
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../routes/svelte-elements.php');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../config/svelte-elements.php' => config_path('svelte-elements.php'),
            ], 'svelte-elements-config');

            $this->publishes([
                __DIR__ . '/../resources/stubs/vite.config.stub.js' => resource_path('js/vendor-stubs/svelte-elements.vite.config.stub.js'),
                __DIR__ . '/../resources/stubs/svelte-all.stub.js' => resource_path('js/svelte-all.js'),
            ], 'svelte-elements-stubs');
        }
    }
}
