import type { IconElement } from "@/icons";
export type { IconElement } from "@/icons";

export type NavTextStdItem = {
    id?: string;
    text: string;
    link?: string;
    target?: "_blank" | "_self";
}

export type IconId = `:${string}:`;
export type IconHTML = `<${string}>`;

// :xxx: or :xxx:link or ReactNode
export type NavIconStdItem<T = IconId | IconHTML | IconElement> = {
    id?: string;
    icon: T; // html string or node
    title?: string;
    link?: string;
    target?: "_blank" | "_self";
}

export type NavTextItem = string | NavTextStdItem;
export type NavIconItem = IconId | IconHTML | IconElement | NavIconStdItem<IconId | IconHTML | IconElement>;
