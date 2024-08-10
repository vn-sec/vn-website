type WrapReturnType<T> = {
    [K in keyof T]:
    T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : WrapReturnType<T[K]>;
};

export function wrapParser<T, S extends Record<string, any>>(conf: T, ParserObject: S): WrapReturnType<S> {
    const keys = Object.getOwnPropertyNames(ParserObject);
    const cache: {
        [k in keyof typeof keys]?: any;
    } = {}
    return new Proxy(ParserObject, {
        get(target, prop, receiver) {
            if (typeof prop === "string" && keys.includes(prop as string)) {
                if (Object.prototype.hasOwnProperty.call(cache, prop)) {
                    // hit cache
                    return cache[prop as any];
                } else {
                    // new to cache
                    const r = Reflect.get(target, prop, receiver);
                    const v = typeof r === "function" ? r(conf) :
                        typeof r === "object" ? wrapParser(conf, r) : r;
                    cache[prop as any] = v;
                    return v;
                }
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
