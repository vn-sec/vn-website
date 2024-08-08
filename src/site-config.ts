import type { NavConfig } from './types/nav';
import YAML from 'yaml';
import fs from 'node:fs';
import type { HonorInfo } from './scripts/honor-md';

export interface SiteConfig {
    navbar: NavConfig;
    page: {
        "index": {
            title: string;
            description: string
        },
        "honor": HonorInfo[] | string; // string: Path to markdown file (remote or local)
    }
}

const siteConfig: SiteConfig = YAML.parse(fs.readFileSync('./site-config.yml', 'utf8'));

export default siteConfig;