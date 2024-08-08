import type * as NavTypes from "@/types/nav";
import type { ValueOf } from "node_modules/astro/dist/type-utils";
import type { Props as NavItemProps } from "@/components/NavItem.astro";

function assertType<T>(t: any, expression: any): t is T {
    return Boolean(expression);
}

function isActive(active?: string, text?: string, id?: string) {
    if (typeof active === "string" && typeof id === "string") {
        return active === id;
    } else if (typeof active === "string" && typeof text === "string") {
        return active.toLowerCase() === text.toLowerCase();
    }
    // return false;
    return undefined;
}

export function stdfyConfig(
    navconf: NavTypes.NavConfig,
    type: keyof NavTypes.NavConfig,
    active?: string
): NavItemProps[] {
    if (!navconf[type]) return [];
    if (type === "title") {
        let e = navconf[type];
        if (!Array.isArray(e)) e = [e];
        return e.map(item => {
            if (typeof item === "string") {
                return {
                    type: "text",
                    props: {
                        text: item,
                        active: isActive(active, item)
                    }
                }
            } else if (assertType<NavTypes.NavIconStdItem>(item, Object.prototype.hasOwnProperty.call(item, "icon"))) {
                return {
                    type: "icon",
                    props: {
                        icon: item.icon,
                        title: item.title,
                        link: item.link,
                        target: item.target,
                        // active:
                    }
                };
            } else {
                return {
                    type: "text",
                    props: {
                        text: item.text,
                        link: item.link,
                        target: item.target,
                        active: isActive(active, item.text, item.id)
                    }
                };
            }
        });
    } else if (type === "content") {
        let e = navconf[type];
        if (!Array.isArray(e)) e = [e];
        return e.map(item => {
            if (typeof item === "string") {
                return {
                    type: "text",
                    props: {
                        text: item,
                        active: isActive(active, item)
                    }
                }
            } else if (assertType<NavTypes.NavIconStdItem>(item, Object.prototype.hasOwnProperty.call(item, "icon"))) {
                return {
                    type: "icon",
                    props: {
                        icon: item.icon,
                        title: item.title,
                        link: item.link,
                        target: item.target,
                    }
                };
            } else {
                return {
                    type: "text",
                    props: {
                        text: item.text,
                        link: item.link,
                        target: item.target,
                        active: isActive(active, item.text, item.id)
                    }
                };
            }
        });
    } else if (type === "icon") {
        let e = navconf[type];
        if (!Array.isArray(e)) e = [e];
        return e.map(item => {
            if (assertType<NavTypes.NavIconStdItem>(item, Object.prototype.hasOwnProperty.call(item, "icon"))) {
                return {
                    type: "icon",
                    props: {
                        icon: item.icon,
                        title: item.title,
                        link: item.link,
                        target: item.target,
                    }
                };
            }
            return {
                type: "icon",
                props: {
                    icon: item,
                }
            };
        });
    } else return [];
}