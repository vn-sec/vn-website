import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    base: '/',
    root: '.',
    srcDir: 'src',
    publicDir: 'public',
    outDir: 'dist',

    output: "static",

    integrations: [react()],
});
