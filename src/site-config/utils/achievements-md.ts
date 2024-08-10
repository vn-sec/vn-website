import Markdown from "../../scripts/markdown";

import type { AchievementsInfo, SiteConfig } from "@/types/site-config";

type NotStringAndArray<T> = T extends string | Array<any> | undefined ? never : T;
type AchievementsConfig = NotStringAndArray<SiteConfig["page"]["achievements"]>;

type MarkdownIt = typeof Markdown.prototype.mdit;

function getLines(text: string, start: number, end: number = Infinity) {
    let tot_lines = 1;
    for (let i = 0; i < text.length; ++i) {
        if (text[i] === '\n') {
            ++tot_lines;
        }
    }
    while (end < 0) end = tot_lines + end;
    let curline = 0;
    let res = '';
    let sIdx = 0;

    for (let i = 0; i < text.length; ++i) {
        if (text[i] === '\n' || i === text.length - 1) {
            if (curline >= start && curline < end) {
                res += text.slice(sIdx, i + 1);
            }
            ++curline;
            sIdx = i + 1;
        }
        if (curline >= end) {
            break;
        }
    }

    return res;
}

export class Extractor {
    private mdit: MarkdownIt;
    private result: AchievementsConfig;
    private _text: string;

    constructor() {
        this.mdit = new Markdown({ externalLink: true }).mdit;
        this.result = {
            content: [],
        };
        this._text = '';
        const that = this;

        this.mdit.use(function (md: MarkdownIt) {
            // extract h1
            md.core.ruler.push('extract_h1', function (state) {
                const tokens = state.tokens;
                let title = '';
                let title_found = false;
                // raw markdown
                let subtitle = '';
                let title_end_pos: number | undefined = undefined;
                let subtitle_start_pos: number | undefined = undefined;
                let subtitle_end_pos = Infinity;

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];

                    if (token.type === 'heading_open' && token.tag === 'h1') {
                        title = md.renderer.render([tokens[i + 1]], {}, {}); // inline
                        title_end_pos = token.map?.[1]
                        i += 2; // Skip heading_close token
                        title_found = true;
                    } else if (title_found && token.type !== 'heading_open') {
                        if (token.map) {
                            if (typeof subtitle_start_pos == 'undefined') {
                                subtitle_start_pos = token.map[0];
                            }
                            subtitle_end_pos = token.map[1];
                        }
                    } else if (title_found) {
                        if (token.map) subtitle_end_pos = token.map[0];
                        break;
                    }
                }
                if (title) that.result.title = title;

                if (typeof subtitle_start_pos === "undefined") {
                    subtitle_start_pos = title_end_pos;
                }
                if (typeof subtitle_start_pos !== "undefined") {
                    subtitle = getLines(that._text, subtitle_start_pos, subtitle_end_pos);
                }

                if (subtitle) that.result.subtitle = subtitle;
            });

            // extract h2
            md.core.ruler.push('extract_h2', function (state) {
                const tokens = state.tokens;
                type H2Info = {
                    title: string;
                    map: [number | undefined, number | undefined];
                    head_end: number | undefined;
                }
                const h2infos: H2Info[] = [];
                let currentH2: H2Info | null = null;

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];

                    if (token.type === 'heading_open' && token.tag === 'h2') {
                        currentH2 = {
                            title: md.renderer.render([tokens[i + 1]], {}, {}), // inline
                            map: [undefined, token.map?.[1]],
                            head_end: token.map?.[1],
                        };
                        h2infos.push(currentH2);
                        i += 2; // Skip heading_close token
                    } else if (currentH2) {
                        if (token.map) {
                            if (typeof currentH2.map[0] === 'undefined') {
                                currentH2.map[0] = token.map[0];
                            }
                            currentH2.map[1] = token.map[1];
                        }
                    }
                }

                const res: AchievementsInfo[] = h2infos.map(info => {
                    let r = {
                        title: info.title,
                        content: ""
                    }
                    if (typeof info.map[0] === 'undefined') info.map[0] = info.head_end;
                    if (typeof info.map[1] === 'undefined') info.map[1] = info.map[0];
                    if (typeof info.map[0] === "number" && typeof info.map[1] === "number") {
                        r.content = getLines(that._text, info.map[0], info.map[1]);
                    }
                    return r;
                })

                that.result.content = res;
            });
        })
    }

    parse(text: string) {
        this.result = {
            content: [],
        };
        this._text = Markdown.parse(text).content;
        this.mdit.parse(this._text, {});
        this._text = '';
        return this.result;
    }
}