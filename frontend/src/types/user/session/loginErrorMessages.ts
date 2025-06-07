import { LoginResult } from './loginResultID.ts';

export const LoginErrorMessages: Record<string, string> = {
    [LoginResult.InvalidCredentials]: 'Wrong username or password',
    [LoginResult.NetworkError]: 'Connection error. Please try again later',
    [LoginResult.AccountLocked]: 'User account has been locked',
    [LoginResult.ServerError]: 'Internal server error',
    [LoginResult.Undefined]: 'Undefined server error',
};