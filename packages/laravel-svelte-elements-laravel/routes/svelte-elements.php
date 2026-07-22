<?php

use Dobrys\SvelteElements\Http\Controllers\TranslationsController;
use Illuminate\Support\Facades\Route;

Route::get(config('svelte-elements.translations_uri', '/translations/{locale}.json'), TranslationsController::class)
    ->where('locale', '[A-Za-z_-]+')
    ->middleware(config('svelte-elements.middleware', []))
    ->name('svelte-elements.translations');
