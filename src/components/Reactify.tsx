import { cloneElement } from "react";

export default function ReactComponent({ el, ...rest }: { el: React.ReactElement }) {
    return cloneElement(el, rest);
}
