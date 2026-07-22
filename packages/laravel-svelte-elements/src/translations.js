let translations = {};

/**
 * @param {string} locale
 * @param {(locale: string) => string} urlFor - locale -> URL за JSON преводите
 */
export async function loadTranslations(locale, urlFor) {
  try {
    const response = await fetch(urlFor(locale));
    if (!response.ok) throw new Error(`Translations request failed: ${response.status}`);
    translations = await response.json();
  } catch (error) {
    console.error('[laravel-svelte-elements] failed to load translations:', error);
    translations = {};
  }
}

export function __(key) {
  return translations[key] || key;
}
