export const ERROR_CODES = {
    INVALID_TOKEN: 0xFF10001,
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
