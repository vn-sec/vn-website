import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import react from '@astrojs/react';
import fs from "node:fs";
import path from "node:path";

function addWatchDir(dirname, { addWatchFile, config }) {
    const files = fs.readdirSync(new URL(dirname, config.root));
    for (const fp of files) {
        addWatchFile(new URL(path.join(dirname, fp), config.root));
    }
}

// https://astro.build/config
export default defineConfig({
    base: '/',
    root: '.',
    srcDir: 'src',
    publicDir: 'public',
    outDir: 'dist',
    cacheDir: '.astro',

    output: "static",

    integrations: [icon(), react(), {
        name: "watch-config",
        hooks: {
            async "astro:config:setup"({ config, logger, addWatchFile }) {
                addWatchFile(new URL("./site-config.yml", config.root));
                addWatchDir("./config", { addWatchFile, config });
            }
        }
    }],
});
