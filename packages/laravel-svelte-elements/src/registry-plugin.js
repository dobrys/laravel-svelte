import { generateRegistry } from './generate-registry.js';

/**
 * Vite plugin, който регенерира registry-то при всеки dev/build старт —
 * консуматорът не трябва да пуска отделна npm команда преди `vite`/`vite build`.
 */
export function registryPlugin({ componentsDir, registryOut, generateOnBuild }) {
  return {
    name: 'laravel-svelte-elements:registry',
    buildStart() {
      if (!generateOnBuild) return;
      const { count } = generateRegistry({ componentsDir, registryOut });
      console.log(`[laravel-svelte-elements] registry: ${count} component(s) -> ${registryOut}`);
    },
  };
}
