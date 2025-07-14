import axios from 'axios';
import { config } from '../config.js';
import type { AxiosRequestConfig } from 'axios';

export async function userClientRequest<T = any>(
    configOverride: AxiosRequestConfig,
    clientCookie?: string,
    accessToken?: string
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(clientCookie ? { Cookie: clientCookie } : {}),
        ...(accessToken ? { Authorization: `Access ${accessToken}` } : {}),
    };

    const response = await axios.request<T>({
        baseURL: config.baseUrl,
        ...configOverride,
        headers,
    });

    return response.data;
}