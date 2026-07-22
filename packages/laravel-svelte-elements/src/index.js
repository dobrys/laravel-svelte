// Browser-safe barrel — само това се тегли от `svelte-all.js` в консуматора.
// generateRegistry() умишлено НЕ е тук: ползва Node `fs`/`path`, само build-time
// (registry-plugin.js / bin/generate-registry.js го викат директно от './generate-registry.js').
export { createLoader } from './loader.js';
export { __ } from './translations.js';
