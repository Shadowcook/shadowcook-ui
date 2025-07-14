export interface ApiResponse<T> {
    transactionId: string;
    cookies: unknown[];
    success: boolean;
    responseTime: number;
    messages: string[];
    errorCodes: number[];
    errorHexCodes: string[];
    errors: number[];
    time: number;
    [key: string]: unknown | T;
}