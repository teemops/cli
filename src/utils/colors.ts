export function yellow(s: unknown) {
    return `\x1b[33m${s}\x1b[0m`;
}

export function green(s: unknown) {
    return `\x1b[32m${s}\x1b[0m`;
}

export function blue(s: unknown) {
    return `\x1b[34m${s}\x1b[0m`;
}

export function red(s: unknown) {
    return `\x1b[31m${s}\x1b[0m`;
}

export function gray(s: unknown) {
    return `\x1b[90m${s}\x1b[0m`;
}

export function cyan(s: unknown) {
    return `\x1b[36m${s}\x1b[0m`;
}

export function magenta(s: unknown) {
    return `\x1b[35m${s}\x1b[0m`;
}

export function lightBlue(s: unknown) {
    return `\x1b[94m${s}\x1b[0m`;
}

export function lightGreen(s: unknown) {
    return `\x1b[92m${s}\x1b[0m`;
}

//teemops orange from teemops.com
export function orange(s: unknown) {
    return `\x1b[38;5;208m${s}\x1b[0m`;
}