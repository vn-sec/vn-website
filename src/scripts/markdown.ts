import MarkdownIt from "markdown-it";

export function Markdown(enternalLink = true) {
    const md = new MarkdownIt();

    if (enternalLink) {
        md.renderer.rules["link_open"] = function (tokens, idx, options, env, self) {
            if (enternalLink) {
                tokens[idx].attrSet('target', '_blank');
            }
            return self.renderToken(tokens, idx, options);
        }
    }

    return md
}