import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Set up tsx transpiler
await import('./node_modules/tsx/dist/esm/index.mjs');

// Import and run the server
await import('./server.ts');
