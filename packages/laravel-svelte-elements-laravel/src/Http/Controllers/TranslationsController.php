<?php

namespace Dobrys\SvelteElements\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class TranslationsController extends Controller
{
    public function __invoke(string $locale): JsonResponse
    {
        $path = lang_path("{$locale}.json");

        if (! file_exists($path)) {
            return response()->json([], 404);
        }

        return response()->json(json_decode(file_get_contents($path), true) ?? []);
    }
}
