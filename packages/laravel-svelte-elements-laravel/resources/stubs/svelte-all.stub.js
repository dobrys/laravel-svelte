import { createLoader } from 'laravel-svelte-elements';
import { registry } from './component-registry.js';

createLoader({
  registry,
  localeGlobal: 'appLocale',
  translationsUrl: (locale) => `/translations/${locale}.json`,
}).start();
