import { loadTranslations } from './translations.js';

/**
 * @param {object} options
 * @param {Record<string, () => Promise<any>>} options.registry - tag -> dynamic import
 * @param {string} [options.localeGlobal='appLocale'] - име на window global с текущия locale
 * @param {string} [options.defaultLocale='en']
 * @param {(locale: string) => string} [options.translationsUrl] - ако е пропуснато, преводи не се зареждат
 * @param {Element} [options.root] - корен за MutationObserver, по подразбиране document.body
 */
export function createLoader(options) {
  const {
    registry,
    localeGlobal = 'appLocale',
    defaultLocale = 'en',
    translationsUrl,
    root,
  } = options;

  return {
    async start() {
      const locale = window[localeGlobal] || defaultLocale;
      if (translationsUrl) {
        await loadTranslations(locale, translationsUrl);
      }

      const loaded = new Set();
      const tags = Object.keys(registry);
      const selector = tags.join(',');
      if (!selector) return;

      function loadTag(tag) {
        if (loaded.has(tag) || !registry[tag]) return;
        loaded.add(tag);
        registry[tag]().catch((err) => console.error('[laravel-svelte-elements] failed to load', tag, err));
      }

      // Компонентите налични в текущия DOM
      const initial = [];
      document.querySelectorAll(selector).forEach((el) => {
        const tag = el.tagName.toLowerCase();
        if (!loaded.has(tag)) {
          loaded.add(tag);
          initial.push(registry[tag]());
        }
      });
      await Promise.all(initial);

      // Компоненти, добавени динамично (Livewire re-renders, модали и т.н.)
      const observeRoot = root || document.body;
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType !== 1) continue;
            loadTag(node.tagName.toLowerCase());
            node.querySelectorAll?.(selector).forEach((el) => loadTag(el.tagName.toLowerCase()));
          }
        }
        if (loaded.size === tags.length) observer.disconnect();
      });
      observer.observe(observeRoot, { childList: true, subtree: true });

      return observer;
    },
  };
}
