<?php

return [
    /*
     | URI за GET заявка, връщаща JSON преводите за даден locale.
     | Трябва да съвпада с translationsUrl, подаден на createLoader() в JS.
     */
    'translations_uri' => '/translations/{locale}.json',

    /*
     | Middleware, приложен върху translations route-а (напр. 'web' за session/cookie достъп).
     */
    'middleware' => [],
];
