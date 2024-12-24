import type { NavIconItem, NavIconStdItem, NavTextItem } from "@/types/nav";

export type ValueOrArray<T> = T | T[];

// string: Path to markdown file (remote or local)
export type WithConfigUrl<T extends (Record<string, any> | Array<any>)> = string | T;

export interface PageConfig<T = markdown> {
    title?: markdown; // text
    subtitle?: markdown;
    content: T;
}

export interface NavConfig {
    title?: ValueOrArray<NavTextItem | NavIconStdItem>
    content?: Array<NavTextItem | NavIconStdItem>;
    icon?: ValueOrArray<NavIconItem>;
}

export interface IndexConfig {
    title: string;
    description: string;
    about: PageConfig;
}

export interface MemberInfo {
    avatar?: string;
    name: string;
    tags?: string | string[];
    link?: string;
    description?: markdown;
}

export type AchievementsInfo = {
    title: string;
    content: markdown;
}

export interface SiteConfig {
    title: string;
    navbar: WithConfigUrl<NavConfig>;
    page: {
        "index": WithConfigUrl<IndexConfig>;
        "achievements"?: WithConfigUrl<AchievementsInfo[] | PageConfig<AchievementsInfo[]>>;
        "members"?: WithConfigUrl<MemberInfo[] | PageConfig<MemberInfo[]>>;
        "join"?: WithConfigUrl<PageConfig>;
    }
    footer: {
        copyright?: markdown;
        icp?: markdown;
        gongan?: markdown;
        extra?: markdown;
    }
}
