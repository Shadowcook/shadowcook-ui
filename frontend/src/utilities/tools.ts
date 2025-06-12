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

    return { entropy, bitsPerChar };
}

export function encodeBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes)
        .map(b => String.fromCharCode(b))
        .join("");
    return btoa(binaryString);
}