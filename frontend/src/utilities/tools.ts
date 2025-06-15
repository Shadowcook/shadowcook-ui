import {ApiResponse} from "../types/apiResponse.ts";

export function isApiResponse<T>(res: unknown): res is ApiResponse<T> {
    return typeof res === "object" && res !== null && "success" in res;
}

export function calculatePasswordEntropy(password: string): { entropy: number, bitsPerChar: number } {
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    const bitsPerChar = Math.log2(charsetSize || 1);
    const entropy = bitsPerChar * password.length;

    return {entropy, bitsPerChar};
}

export function encodeBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes)
        .map(b => String.fromCharCode(b))
        .join("");
    return btoa(binaryString);
}

export function formatUtcIsoString(input: string): string {
    const date = new Date(input);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const min = String(date.getUTCMinutes()).padStart(2, "0");
    const sec = String(date.getUTCSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
}

export function sortByField<T>(
    array: T[],
    field: keyof T,
    direction: "asc" | "desc" = "asc"
): T[] {
    return [...array].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (typeof aValue === "string" && typeof bValue === "string") {
            const result = aValue.localeCompare(bValue, undefined, {
                numeric: true,
                sensitivity: "base"
            });
            return direction === "asc" ? result : -result;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });
}