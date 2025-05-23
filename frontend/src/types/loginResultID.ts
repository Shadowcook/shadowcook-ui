export const LoginResult = {
    InvalidCredentials: 'invalid_credentials',
    NetworkError: 'network_error',
    AccountLocked: 'account_locked',
    ServerError: 'server_error',
    Success: 'success',
    Undefined: 'undefined',
} as const;

export type LoginResultID = typeof LoginResult[keyof typeof LoginResult];