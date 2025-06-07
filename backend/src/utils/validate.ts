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
