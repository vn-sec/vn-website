import type { NavConfig } from './types/nav';
import _YAML from 'yaml';
import fs from 'node:fs';
import type { HonorInfo } from './scripts/honor-md';

export const YAML = _YAML;

export const loadConfigIfUrlString = async <T = any>(o: string | T, cb: (f: string) => T | Promise<T>): Promise<T> => {
    if (typeof o === "string") {
        let file_content: string;
        if (/^https?\/\/.+/.test(o)) {
            file_content = await fetch(o).then(res => res.text());
        } else {
            file_content = fs.readFileSync(o, "utf-8");
        }
        return cb(file_content);
    } else {
        return o;
    }
}

export interface MemberInfo {
    avatar?: string;
    name: string;
    tags?: string | string[];
    link?: string;
    description?: string;
}

export interface SiteConfig {
    navbar: NavConfig;
    page: {
        "index": {
            title: string;
            description: string
        },
        "honor"?: HonorInfo[] | string; // string: Path to markdown file (remote or local)
        "members"?: MemberInfo[] | string; // string: Path to yaml file (remote or local)

    }
}

const siteConfig: SiteConfig = YAML.parse(fs.readFileSync('./site-config.yml', 'utf8'));

export default siteConfig;