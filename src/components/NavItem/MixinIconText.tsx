import type { IconElement } from "@/icons";
import * as icons from "@/icons";

type TextMeta = {
    type: "text";
    literal: string;
};
type IconMeta = {
    type: "icon";
    element: IconElement;
    style?: ("inline" | "title" | "non-hover")[];
};
type MixinMeta = TextMeta | IconMeta;

export default function MixinIconText({ text }: { text: string }) {
    let metas: MixinMeta[] = [];
    const push = (meta: MixinMeta) => {
        if (metas.length > 0 && meta.type === "text" && metas[metas.length - 1].type === "text") {
            (metas[metas.length - 1] as TextMeta).literal += meta.literal;
        } else {
            metas.push(meta);
        }
    };
    let lastPos = 0;
    let onWaitingIcon = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c !== ":") continue;
        if (onWaitingIcon) {
            let sub = text.substring(lastPos, i);
            let match = /([^()]+)\s*(\((.+)\))?/.exec(sub);
            let iconId = match ? match[1] : sub;
            let iconStyle = match ? match[3] : undefined;
            let iconElement = icons[iconId as keyof typeof icons] as IconElement | undefined;
            if (typeof iconElement === "undefined") {
                push({ type: "text", literal: ":" + iconId });
                onWaitingIcon = true;
            } else {
                push({
                    type: "icon",
                    element: iconElement,
                    style: iconStyle ? (iconStyle.split(/\s+/) as NonNullable<IconMeta["style"]>) : []
                });
                onWaitingIcon = false;
            }
        } else {
            let str = text.substring(lastPos, i);
            if (str.length > 0) {
                push({ type: "text", literal: str });
            }
            onWaitingIcon = true;
        }
        lastPos = i + 1;
    }
    let remaining = (onWaitingIcon ? ":" : "") + text.substring(lastPos);
    if (remaining.length > 0) {
        push({ type: "text", literal: remaining });
    }
    return (
        <span data-has-icon="true">
            {metas.map(meta => {
                if (meta.type === "text") {
                    return <span>{meta.literal}</span>;
                } else if (meta.type === "icon") {
                    return <span data-icon-style={(meta.style ?? ["inline"]).join(" ")}>{meta.element}</span>;
                } else {
                    return null;
                }
            })}
        </span>
    );
}
