export interface ApiResponse<T> {
    transactionId: string;
    cookies: unknown[];
    success: boolean;
    responseTime: number;
    messages: string[];
    errorCodes: string[];
    errorHexCodes: string[];
    errors: string[];
    time: number;
    [key: string]: unknown | T;
}