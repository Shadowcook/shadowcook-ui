import {authClient, authJar} from './authClient.js';
import type {AxiosRequestConfig} from 'axios';
import {config} from '../config.js';
import {getAccessToken, setAccessToken} from "../accessTokenStore.js";

const ERROR_INVALID_TOKEN = 0xFF01001;
const ERROR_INVALID_CREDENTIALS = 0xFF0000;

function hasError(responseData: any, code: number): boolean {
    return Array.isArray(responseData?.errors) && responseData.errors.includes(code);
}

async function tryRefresh(): Promise<boolean> {
    console.log("Trying to refresh...");
    try {
        const res = await authClient.get('/auth/refresh', {withCredentials: true});
        console.log("Refresh result: ", res);
        if (res.data.success && res.data.auth?.accessToken) {
            setAccessToken(res.data.auth.accessToken);
        }
        return res.data.success && !hasError(res.data, ERROR_INVALID_TOKEN);
    } catch {
        return false;
    }
}

async function tryLogin(): Promise<boolean> {
    console.log("Trying to login...");
    try {
        const loginUrl = `/auth/login/${config.username}/${config.password}`;
        const res = await authClient.get(loginUrl);
        if (res.data.success && res.data.accessToken) {
            console.log("Setting login token: ", res.data.accessToken);
            setAccessToken(res.data.accessToken);
            console.log("Jar after login:");
            console.log(await authJar.getCookies(config.baseUrl));
        } else {
            console.error("Login failed: ", res.data);
        }
        return res.data.success && !hasError(res.data, ERROR_INVALID_CREDENTIALS);
    } catch (err) {
        console.error("Login failed with exception: ", err);
        return false;
    }
}

export async function defaultApiRequest<T = any>(
    requestConfig: AxiosRequestConfig
): Promise<T> {
    const attempt = async () => {

        const token = getAccessToken();
        console.log(`Sending attempt with token [${token}]: `, attempt);
        const response = await authClient.request<T>({
            ...requestConfig,
            headers: {
                ...(requestConfig.headers ?? {}),
                Authorization: `Access ${token}`,
            },
        });
        
        if (response.data && (response.data as any).success === false && hasError(response.data, ERROR_INVALID_TOKEN)) {
            throw new Error('INVALID_TOKEN');
        }
        return response.data;
    };

    try {
        return await attempt();
    } catch (err: any) {
        if (err.message === 'INVALID_TOKEN') {
            console.log("Token invalid. Trying to refresh...");
            const refreshed = await tryRefresh();
            if (!refreshed) {
                console.log(`Refresh failed. Trying to login again.`);
                const loggedIn = await tryLogin();
                if (!loggedIn) {
                    throw new Error('Default client re-authentication failed');
                } else {
                    console.log("Login successful");
                }
            }
            console.log("Attempting API call again");
            return await attempt();
        }
        throw err;
    }
}