export function isValidId(input: unknown): boolean {
    const id = Number(input);

    if (
        !Number.isInteger(id) ||
        id < 0 ||
        id > Number.MAX_SAFE_INTEGER
    ) {
        console.log(({id: id, input: input}));
        console.log(({
            "isNumber": Number.isInteger(id),
            "id<0": id < 0,
            "id>Max.Int": id > Number.MAX_SAFE_INTEGER
        }));
        return false;
    }

    return true;
}
