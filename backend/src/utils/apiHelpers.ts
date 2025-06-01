import axios, {AxiosResponse} from 'axios';
import {defaultClient} from './apiClient.js';
import {sanitizeUrl} from './toolbox.js';
import {config} from '../config.js'

export async function apiRequest<T>(
    endpoint: string,
    body = {},
    clientCookies?: string
): Promise<T> {
    try {
        if (clientCookies) {
            const response = await axios.post<T>(sanitizeUrl(config.baseUrl, endpoint), body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': clientCookies,
                },
                withCredentials: true,
            });
            return response.data;
        } else {
            const response = await defaultClient.post<T>(endpoint, body);
            return response.data;
        }
    } catch (err) {
        console.error('API Error:', (err as Error).message);
        throw err;
    }
}

export async function apiGet<T>(
    endpoint: string,
    clientCookies?: string
): Promise<T> {
    try {
        if (clientCookies) {
            const sanitizedUrl = sanitizeUrl(config.baseUrl, endpoint)
            console.log("Accessing URL: " + sanitizedUrl);
            const response = await axios.get<T>(sanitizedUrl, {
                headers: {
                    'Cookie': clientCookies,
                },
                withCredentials: true,
            });
            return response.data;
        } else {
            const response = await defaultClient.get<T>(endpoint);
            return response.data;
        }
    } catch (err) {
        console.error('API Error:', (err as Error).message);
        throw err;
    }
}

export async function apiGetFull<T>(
    endpoint: string,
    clientCookies?: string
): Promise<AxiosResponse<T>> {
    return axios.get<T>(sanitizeUrl(config.baseUrl, endpoint), {
        headers: clientCookies ? {Cookie: clientCookies} : undefined,
        withCredentials: true
    });
}
