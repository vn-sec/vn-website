import type { NavConfig } from './types/nav';
import YAML from 'yaml';
import fs from 'node:fs';

export interface SiteConfig {
    navbar: NavConfig;
    page: {
        "index": {
            title: string;
            description: string
        }
    }
}

const siteConfig: SiteConfig = YAML.parse(fs.readFileSync('./site-config.yml', 'utf8'));

export default siteConfig;