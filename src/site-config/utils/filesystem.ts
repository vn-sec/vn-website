import _YAML from 'yaml';
import fs from 'node:fs';
import Markdown from '@/scripts/markdown';

export const YAML = _YAML;

export function isFileExists(pathname: string): boolean {
    try {
        return fs.existsSync(pathname);
    } catch (e) {
        return false;
    }
}

export function parseConfigFile(pathname: string, encoding: BufferEncoding = "utf-8"): any {
    let filepath: string | undefined = undefined;
    let file_content: string | undefined;
    let ext = [".json", ".yml", ".yaml"];
    for (let e of ext) {
        if (pathname.endsWith(e) && isFileExists(pathname)) {
            filepath = pathname;
            break;
        }
    }
    if (!filepath) {
        for (let e of ext) {
            if (isFileExists(pathname + e)) {
                filepath = pathname + e;
                break;
            }
        }
    }
    if (!filepath) {
        throw new Error(`File not found: ${pathname}`);
    }
    try {
        file_content = fs.readFileSync(filepath, encoding);
    } catch (e) {
        throw new Error(`Failed to read file: ${filepath}`);
    }

    if (filepath.endsWith(".json")) {
        return JSON.parse(file_content);
    } else {
        return YAML.parse(file_content);
    }
}

type ExcludeString<T> = T extends string ? never : T;

function parseConf(f: string, p: string, fallback: "yaml" | "json" | "throw" = "throw") {
    if (p.endsWith(".json")) return JSON.parse(f);
    if (p.endsWith(".yml") || p.endsWith(".yaml")) return YAML.parse(f);
    if (fallback === "yaml") return YAML.parse(f);
    if (fallback === "json") return JSON.parse(f);
    throw new Error(`Unknown file type: ${p}`);
}

const utils = {
    YAML, JSON, Markdown, parseConf
};

type CallbackForLoadConfig<T> = (f: string, p: string, u: typeof utils) => ExcludeString<T> | Promise<ExcludeString<T>>;

/**
 * If the input is a string, it will load the file content from the URL or the file path.
 * Otherwise, it will return the input as it is.
 * @param o The input string or object.
 * @param cb The callback function to parse the file content.
 */
export async function autoGetConfig<T = any>
    (o: T, cb: CallbackForLoadConfig<T>): Promise<ExcludeString<T>> {
    if (typeof o === "string") {
        let file_content: string;
        if (/^https?\/\/.+/.test(o)) {
            file_content = await fetch(o).then(res => res.text());
        } else {
            file_content = fs.readFileSync(o, "utf-8");
        }
        return cb(file_content, o, utils);
    } else {
        return o as ExcludeString<T>;
    }
}