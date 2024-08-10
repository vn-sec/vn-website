import _YAML from 'yaml';
import fs from 'node:fs';
import type { SiteConfig } from "@/types/site-config";

export * from "@/types/site-config";

export const YAML = _YAML;

function parseYamlFile(pathname: string, encoding: BufferEncoding = "utf-8"): any {
    let file_content: string | undefined;
    let ext = [".yml", ".yaml"];
    for (let e of ext) {
        if (pathname.endsWith(e)) {
            try { file_content = fs.readFileSync(pathname, encoding); break; }
            catch (e) { continue; }
        }
    }
    for (let e of ext) {
        try { file_content = fs.readFileSync(pathname + e, encoding); break; }
        catch (e) { continue; }
    }
    if (!file_content) {
        throw new Error(`Cannot find YAML file: ${pathname}`);
    }
    return YAML.parse(file_content);
}

type ExcludeString<T> = T extends string ? never : T;
export const loadConfigIfUrlString = async <T = any>(o: string | ExcludeString<T>, cb: (f: string, utils: { YAML: typeof YAML }) => ExcludeString<T> | Promise<ExcludeString<T>>): Promise<ExcludeString<T>> => {
    if (typeof o === "string") {
        let file_content: string;
        if (/^https?\/\/.+/.test(o)) {
            file_content = await fetch(o).then(res => res.text());
        } else {
            file_content = fs.readFileSync(o, "utf-8");
        }
        return cb(file_content, { YAML });
    } else {
        return o;
    }
}

const siteConfig: SiteConfig = parseYamlFile('./site-config', 'utf8');

export default siteConfig;