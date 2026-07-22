import { svelte } from '@sveltejs/vite-plugin-svelte';
import { registryPlugin } from './src/registry-plugin.js';

/**
 * Връща масив от Vite plugin-и, готови за spread в `plugins: [...]`.
 *
 * @param {object} [options]
 * @param {string} [options.componentsDir='resources/js/components'] - директория за сканиране за .svelte файлове
 * @param {string} [options.registryOut='resources/js/component-registry.js'] - път за генерирания registry
 * @param {boolean} [options.generateOnBuild=true] - регенерирай registry-то автоматично при dev/build старт
 * @param {object} [options.svelteOptions={}] - допълнителни опции, подадени на @sveltejs/vite-plugin-svelte
 */
export function svelteElements(options = {}) {
  const {
    componentsDir = 'resources/js/components',
    registryOut = 'resources/js/component-registry.js',
    generateOnBuild = true,
    svelteOptions = {},
  } = options;

  return [
    svelte({
      ...svelteOptions,
      compilerOptions: {
        customElement: true,
        ...(svelteOptions.compilerOptions || {}),
      },
    }),
    registryPlugin({ componentsDir, registryOut, generateOnBuild }),
  ];
}
