import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { LoginResponse } from './types.js';

import { config } from '../config.js';

console.log(`Using endpoint: ${config.baseUrl}`);

const defaultJar = new CookieJar();

export const defaultClient: AxiosInstance = wrapper(axios.create({
    baseURL: config.baseUrl,
    jar: defaultJar,
    withCredentials: true,
}));

export async function loginDefault(): Promise<boolean> {
    try {
        const loginUrl = `/auth/login/${config.username}/${config.password}`;
        const response = await defaultClient.get<LoginResponse>(loginUrl);
        if (response.data.success) {
            console.log('Default login successful.');
            return true;
        } else {
            console.error('Default login failed.');
            return false;
        }
    } catch (err) {
        console.error('Default login error:', (err as Error).message);
        return false;
    }
}
