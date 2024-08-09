import type { IconElement } from "@/icons";
import * as icons from "@/icons";
import React from "react";
import parseReactHtml from "html-react-parser";
import fs from "node:fs";

type TextMeta = {
    type: "text";
    literal: string;
};
type IconMeta<T = string> = {
    type: "icon";
    literal: string;
    id: string;
    varName: string;
    element: IconElement;
    style?: T[];
};
type MixinMeta<T = string> = TextMeta | IconMeta<T>;

export function toIconId(variableName: string) {
    let reg = /(?<=[a-z\d])[A-Z]/g;
    return variableName.replace(reg, s => "-" + s.toLowerCase()).toLowerCase();
}

export function fromIconId(iconId: string) {
    let reg = /-./g;
    return iconId.replace(reg, s => s[1].toUpperCase());
}

const directroyIcons = fs
    .readdirSync("src/icons")
    .filter(f => f.endsWith(".svg"))
    .map(f => f.replace(/\.svg$/, ""));

export function parseMetaFromRaw<T = string>(raw: string, fromJSX: boolean = false) {
    let metas: MixinMeta<T>[] = [];
    const push = (meta: MixinMeta<T>) => {
        if (metas.length > 0 && meta.type === "text" && metas[metas.length - 1].type === "text") {
            (metas[metas.length - 1] as TextMeta).literal += meta.literal;
        } else {
            metas.push(meta);
        }
    };
    let lastPos = 0;
    let onWaitingIcon = false;
    for (let i = 0; i < raw.length; i++) {
        const c = raw[i];
        if (c !== ":") continue;
        if (onWaitingIcon) {
            let sub = raw.substring(lastPos, i);
            let match = /([^()]+)\s*(\((.+)\))?/.exec(sub);
            let iconId = match ? match[1] : sub;
            let iconVar = fromIconId(iconId);
            let iconStyle = match ? match[3] : undefined;
            let iconStyles = iconStyle ? (iconStyle.split(/\s+/) as NonNullable<IconMeta<T>["style"]>) : [];
            let iconElement: IconElement | undefined;
            if (fromJSX) {
                // from JSX
                iconElement = icons[iconId as keyof typeof icons];
            }
            if ((!fromJSX || typeof iconElement === "undefined") && directroyIcons.includes(iconId)) {
                // from directory, or not found in JSX
                let svgHtml = fs.readFileSync(`src/icons/${iconId}.svg`, "utf-8");
                iconElement = React.cloneElement(parseReactHtml(svgHtml) as React.ReactElement);
            }
            if (typeof iconElement === "undefined") {
                push({ type: "text", literal: ":" + sub });
                onWaitingIcon = true;
            } else {
                push({
                    type: "icon",
                    literal: sub,
                    id: iconId,
                    varName: iconVar,
                    element: iconElement,
                    style: iconStyles
                });
                onWaitingIcon = false;
            }
        } else {
            let str = raw.substring(lastPos, i);
            if (i > 0 && raw[i - 1] === "\\") {
                if (str.length > 0) {
                    push({ type: "text", literal: str.slice(0, -1) + ":" });
                }
            } else {
                if (str.length > 0) {
                    push({ type: "text", literal: str });
                }
                onWaitingIcon = true;
            }
        }
        lastPos = i + 1;
    }
    let remaining = (onWaitingIcon ? ":" : "") + raw.substring(lastPos);
    if (remaining.length > 0) {
        push({ type: "text", literal: remaining });
    }
    if (metas.length === 1 && metas[0].type === "text" && metas[0].literal === "") {
        metas.pop();
    }
    return metas;
}
