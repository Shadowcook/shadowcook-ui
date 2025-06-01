import {SessionState} from "../types/session/sessionState.ts";

export function validateId(input: unknown): number {
    const id = Number(input);

    if (
        !Number.isInteger(id) ||
        id < 0 ||
        id > Number.MAX_SAFE_INTEGER
    ) {
        return Number.MIN_SAFE_INTEGER;
    }

    return id;
}

export function validateAccess(session: SessionState, requiredAccess: number): boolean {
    return session.accesses.some(access => access.accessId === requiredAccess);
}
