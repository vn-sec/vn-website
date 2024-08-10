import { autoGetConfig } from "./utils";
import type { SiteConfig } from "./types";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type WrapPlainReturnType<T> = {
    [K in keyof T]:
    T[K] extends (...args: any[]) => any ? UnwrapPromise<ReturnType<T[K]>> : WrapPlainReturnType<T[K]>;
};

export type StrictSiteConfig = WrapPlainReturnType<typeof SiteConfigParser>;

function plainReadConfig<T>(conf: ((sc: SiteConfig) => T)) {
    return async (sc: SiteConfig) => {
        return await autoGetConfig(
            conf(sc),
            (f, p, { parseConf }) => {
                return parseConf(f, p);
            }
        );
    }
}

export const SiteConfigParser = {
    title: async (sc: SiteConfig) => {
        return sc.title;
    },

    navbar: plainReadConfig(sc => sc.navbar),

    page: {
        "index": plainReadConfig(sc => sc.page.index),

        "achievements": async (sc: SiteConfig) => {
            let conf = sc.page.achievements ?? [];
            conf = Array.isArray(conf) ? { content: conf } : conf;
            return await autoGetConfig(
                conf,
                async (f,) => {
                    const Extractor = await import("@/site-config/utils").then(({ Extractor }) => Extractor)
                    return new Extractor().parse(f);
                }
            )
        },

        "members": async (sc: SiteConfig) => {
            let conf = sc.page.members ?? []
            conf = Array.isArray(conf) ? { content: conf } : conf;
            return await autoGetConfig(
                conf,
                async (f, p, { parseConf },) => {
                    let c = parseConf(f, p);
                    return Array.isArray(c) ? { content: c } : c
                }
            )
        },

        "join": async (sc: SiteConfig) => {
            let conf = sc.page.join ?? { content: "" }
            return await autoGetConfig(
                conf,
                async (f, _, { Markdown },) => {
                    const data = Markdown.parse(f);
                    if (Markdown.isYamlRecord(data.frontmatter)) {
                        return {
                            title: data.frontmatter["title"] ? data.frontmatter["title"].toString() : undefined,
                            subtitle: data.frontmatter["subtitle"] ? data.frontmatter["subtitle"].toString() : undefined,
                            content: data.content
                        };
                    } else {
                        return {
                            content: data.content
                        };
                    }
                }
            )
        }
    }
}