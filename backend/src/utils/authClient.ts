import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { config } from '../config.js';

export const authJar = new CookieJar();

export const authClient = wrapper(axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
    jar: authJar,
    headers: {
        'Content-Type': 'application/json',
    },
}));