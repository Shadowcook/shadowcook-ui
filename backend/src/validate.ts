export function validateId(input: unknown): number | null {
    const id = Number(input);

    if (
        !Number.isInteger(id) ||
        id < 0 ||
        id > Number.MAX_SAFE_INTEGER
    ) {
        return null;
    }

    return id;
}
