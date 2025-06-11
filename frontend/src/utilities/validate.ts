import {SessionState} from "@project-types/user/session/sessionState.ts";
import {AccessId} from "@project-types/role/accessId.ts";

export function isValidId(input: unknown): boolean {
    const id = Number(input);

    if (
        !Number.isInteger(id) ||
        id < 0 ||
        id > Number.MAX_SAFE_INTEGER
    ) {
        return false;
    }
    return true;
}

export function transformIdIfValid(input: unknown): number | undefined {
    if(isValidId(input)) {
        return Number(input);
    } else {
        return undefined;
    }
}

// Returns true, if requiredAccess-ID is found in the session
export function validateAccess(session: SessionState, requiredAccess: number): boolean {
    return validateAnyAccess(session, [requiredAccess, AccessId.ADMIN])
}

// Returns true, if ANY ONE of the requiredAccess-IDs is found in the session
export function validateAnyAccess(session: SessionState, requiredAccess: number[]): boolean {
    return requiredAccess.some(required =>
        session.accesses.some(access => access.accessId === required)
    );
}

export function generateRandomString(length: number = 20): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charsLength = chars.length;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}