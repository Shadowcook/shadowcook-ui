import {SessionState} from "@types/user/session/sessionState.ts";
import {AccessId} from "@types/user/accessId.ts";

export function validateId(input: unknown): number {
    const id = Number(input);

    if (
        !Number.isInteger(id) ||
        id < 0 ||
        id > Number.MAX_SAFE_INTEGER
    ) {
        return 0;
    }

    return id;
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