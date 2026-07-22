#!/usr/bin/env node
import { generateRegistry } from '../src/generate-registry.js';

function parseArgs(argv) {
  const args = {
    componentsDir: 'resources/js/components',
    registryOut: 'resources/js/component-registry.js',
  };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    const value = argv[i + 1];
    if (key === 'components') args.componentsDir = value;
    if (key === 'out') args.registryOut = value;
  }
  return args;
}

const { componentsDir, registryOut } = parseArgs(process.argv.slice(2));
const { count } = generateRegistry({ componentsDir, registryOut });
console.log(`[laravel-svelte-elements] ${count} component(s) registered -> ${registryOut}`);
