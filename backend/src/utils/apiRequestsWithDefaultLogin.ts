import {authClient} from './authClient.js';
import {config} from '../config.js';
import type {AxiosRequestConfig} from 'axios';

async function tryRefreshToken(): Promise<boolean> {
    try {
        const res = await authClient.get('/auth/refresh');
        return res.data?.success ?? false;
    } catch {
        return false;
    }
}

async function tryLogin(): Promise<boolean> {
    try {
        const loginUrl = `/auth/login/${config.username}/${config.password}`;
        const res = await authClient.get(loginUrl);
        return res.data?.success ?? false;
    } catch {
        return false;
    }
}

export async function defaultApiRequest<T = any>(
    config: AxiosRequestConfig
): Promise<T> {
    try {
        const res = await authClient.request<T>(config);
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            console.warn('[DefaultAuth] 401 – trying refresh...');

            const refreshed = await tryRefreshToken();
            if (!refreshed) {
                console.warn('[DefaultAuth] Refresh failed, retrying full login...');
                const relogged = await tryLogin();
                if (!relogged) {
                    console.error('[DefaultAuth] Login failed completely');
                    throw new Error('Default re-authentication failed');
                }
            }

            // Retry original request
            const retryRes = await authClient.request<T>(config);
            return retryRes.data;
        }

        throw err;
    }
}
