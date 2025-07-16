import apiClient from './apiClient.ts';
import {clearAccessToken, getAccessToken, setAccessToken} from "../auth/accessTokenStore.ts";
import {AuthResponse} from "@project-types/user/session/authResponse.ts";

const ERROR_INVALID_TOKEN = 0xFF01001;

type ApiErrorResponse = {
    errors?: number[];
};

function hasInvalidTokenError(data: unknown): data is ApiErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        Array.isArray((data as ApiErrorResponse).errors) &&
        (data as ApiErrorResponse).errors!.includes(ERROR_INVALID_TOKEN)
    );
}

let refreshInProgress: Promise<boolean> | null = null;

export async function tryRefresh(): Promise<boolean> {
    if (!refreshInProgress) {
        refreshInProgress = doRefresh();
    }

    try {
        return await refreshInProgress;
    } finally {
        refreshInProgress = null;
    }
}

async function doRefresh(): Promise<boolean> {
    try {
        const res = await apiClient.get<AuthResponse>('/refresh', {withCredentials: true});
        const authData = res.data;
        console.log({action: 'tryRefresh', payload: authData, result: res});

        if (authData?.success && authData.accessToken) {
            setAccessToken(authData.accessToken);
            return true;
        }
    } catch (error) {
        console.warn('Token refresh failed:', (error as Error).message);
    }

    await apiClient.get<AuthResponse>('/logout', {withCredentials: true});
    clearAccessToken();
    return false;
}


export async function apiGet<T>(url: string): Promise<T> {
    const attempt = async (): Promise<T> => {
        const token = getAccessToken();
        console.log({accessToken: token});
        const res = await apiClient.get<T>(url, {
            headers: token ? {Authorization: `Access ${token}`} : {},
        });

        if (hasInvalidTokenError(res.data)) {
            throw new Error('INVALID_TOKEN');
        }
        return res.data;
    };

    try {
        return await attempt();
    } catch (err) {
        if (err instanceof Error && err.message === 'INVALID_TOKEN') {
            console.log("Refreshing invalid token");
            const refreshed = await tryRefresh();
            if (refreshed) {
                return await attempt();
            } else {
                console.error("Refreshing token failed.");
            }
        } else if (err instanceof Error) {
            console.error("Unrecognized error message: ", err.message);
        } else {
            console.error("Unknown error occurred: ", err);
        }
        throw err;
    }
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
    const attempt = async (): Promise<T> => {
        const token = getAccessToken();
        const res = await apiClient.post<T>(url, body, {
            headers: token ? {Authorization: `Access ${token}`} : {},
            withCredentials: !!token,
        });

        if (hasInvalidTokenError(res.data)) {
            throw new Error('INVALID_TOKEN');
        }

        return res.data;
    };

    try {
        return await attempt();
    } catch (err) {
        if (err instanceof Error && err.message === 'INVALID_TOKEN') {
            const refreshed = await tryRefresh();
            if (refreshed) return await attempt();
        }
        throw err;
    }
}
