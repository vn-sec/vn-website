
import MarkdownIt from "markdown-it";

export type HonorInfo = {
    title: string;
    content: string;
}

export class Extractor {
    private md: MarkdownIt;
    private result: HonorInfo[];

    constructor() {
        this.md = new MarkdownIt();
        this.result = [];
        const that = this;

        // open new tab
        this.md.renderer.rules["link_open"] = function (tokens, idx, options, env, self) {
            tokens[idx].attrSet('target', '_blank');
            return self.renderToken(tokens, idx, options);
        }

        this.md.use(function (md: MarkdownIt) {
            md.core.ruler.push('extract_h2', function (state) {
                const tokens = state.tokens;
                const res = [];
                let currentH2 = null;

                for (let i = 0; i < tokens.length; i++) {
                    const token = tokens[i];

                    if (token.type === 'heading_open' && token.tag === 'h2') {
                        currentH2 = {
                            title: md.renderer.render([tokens[i + 1]], {}, {}), // inline
                            content: ''
                        };
                        res.push(currentH2);
                        i += 2; // Skip heading_close token
                    } else if (currentH2) {
                        currentH2.content += md.renderer.render([token], {}, {});
                    }
                }

                that.result = res;
            });
        })
    }

    parse(text: string) {
        this.result = [];
        this.md.parse(text, {});
        return this.result;
    }
}