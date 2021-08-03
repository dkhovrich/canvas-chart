export function assert(condition: unknown, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

export function assertIsString(val: any): asserts val is string {
    if (typeof val !== "string") {
        throw new Error("Not a string!");
    }
}

export function assertIsNumber(val: any): asserts val is number {
    if (typeof val !== "number") {
        throw new Error("Not a number!");
    }
}

export function assertIsDefined<T>(val: T | undefined): asserts val is T {
    if (typeof val === undefined) {
        throw new Error("Is undefined!");
    }
}

export function isDefined<T>(val: T | undefined): val is T {
    return val !== undefined;
}
