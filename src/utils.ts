export function assert(condition: unknown, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

export function isDefined<T>(val: T | undefined): val is T {
    return val !== undefined;
}

export function isNumber(val: unknown): val is number {
    return typeof val === "number";
}

export function isString(val: unknown): val is string {
    return typeof val === "string";
}
