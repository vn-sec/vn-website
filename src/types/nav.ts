import type { IconElement } from "@/icons";
export type { IconElement } from "@/icons";

type ValueOrArray<T> = T | T[];

export type NavTextStdItem = {
    id?: string;
    text: string;
    target?: "_blank" | "_self";
    link?: string;
}

export type IconId = `:${string}:`;

// :xxx: or :xxx:link or ReactNode
export type NavIconStdItem<T = IconElement> = {
    id?: string;
    icon: T; // html string or node
    title?: string;
    target?: "_blank" | "_self";
    link?: string;
}

export type NavTextItem = string | NavTextStdItem;
export type NavIconItem = IconId | IconElement | NavIconStdItem<IconId | IconElement>;

export type NavTextItems = ValueOrArray<NavTextItem>
export type NavIconItems = ValueOrArray<NavIconItem>;

export interface NavConfig {
    title?: ValueOrArray<NavTextItem | NavIconStdItem>
    content?: Array<NavTextItem | NavIconStdItem>;
    icon?: NavIconItems;
}
