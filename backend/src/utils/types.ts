export interface LoginResponse {
    transactionId: string;
    cookies: string[];
    success: boolean;
    responseTime: number;
    messages: string[];
    errorCodes: string[];
    errorHexCodes: string[];
    errors: string[];
    time: number;
    session: string;
    token: string;
}