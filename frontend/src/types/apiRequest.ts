export interface ApiRequest<T> {
    transactionId: string;
    cookies: unknown[];
    requestTime: number;
    [key: string]: unknown | T;
}