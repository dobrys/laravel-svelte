<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/svelte-test', function () {
    return view('svelte-test');
});
