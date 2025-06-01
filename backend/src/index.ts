import dotenv from 'dotenv';
import express from 'express';
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {CookieJar} from 'tough-cookie';
import {wrapper} from 'axios-cookiejar-support';
import cors from 'cors';
import {LoginResponse} from './types.js';
import {validateId} from "./validate.js";
import {sanitizeUrl} from "./toolbox.js";
import {sessionRouteWrapper} from './sessionRouterWrapper.js';

dotenv.config();

const BASE_URL = process.env.BASE_URL ?? '';
const USERNAME = process.env.SC_USER ?? '';
const PASSWORD = process.env.SC_PASS ?? '';

console.log(`Using endpoint: ${BASE_URL}`)

const defaultJar = new CookieJar();
const defaultClient: AxiosInstance = wrapper(axios.create({
    baseURL: BASE_URL,
    jar: defaultJar,
    withCredentials: true,
}));

async function loginDefault(): Promise<boolean> {
    try {
        const loginUrl = `/auth/login/${USERNAME}/${PASSWORD}`;
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

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // oder '*' für dev
    credentials: true
}));

async function apiRequest<T>(
    endpoint: string,
    body = {},
    clientCookies?: string
): Promise<T> {
    try {
        if (clientCookies) {
            const response = await axios.post<T>(sanitizeUrl(BASE_URL, endpoint), body, {
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

export async function apiGetFull<T>(
    endpoint: string,
    clientCookies?: string
): Promise<AxiosResponse<T>> {
    console.log(`Full request of ${sanitizeUrl(BASE_URL, endpoint)}`);
    return axios.get<T>(sanitizeUrl(BASE_URL, endpoint), {
        headers: clientCookies ? {Cookie: clientCookies} : undefined,
        withCredentials: true
    });
}


async function apiGet<T>(
    endpoint: string,
    clientCookies?: string
): Promise<T> {
    try {
        if (clientCookies) {
            const response = await axios.get<T>(sanitizeUrl(BASE_URL, endpoint), {
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


app.get('/api/session/validate', sessionRouteWrapper(async (cookie, req, res) => {
    const data = await apiGet<any>('/auth/validate', cookie);
    console.log('Validated with cookie:', cookie);
    return data;
}));

app.get('/api/logout', sessionRouteWrapper(async (cookie, req, res) => {
    const data = await apiGet<any>('/auth/logout', cookie);
    console.log(data);
    res.setHeader('Set-Cookie', [
        'activeSession=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    ]);
    return data;
}));


app.get('/api/login/:username/:password', async (req, res) => {
    try {
        const username = req.params.username;
        const password = req.params.password;
        const response = await apiGetFull<any>(`/auth/login/${username}/${password}`);
        console.log(response);
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in user login: ${e}`)
        res.status(500).json({error: 'Internal server error while login'});
    }
});

app.get('/api/getAllCategories', async (req, res) => {
    try {
        const data = await apiGet<any>('/category/getFull');
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching categories.'});
    }
});

app.get('/api/getUomList', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        const data = await apiGet<any>('/uom/get/false', cookie);
        console.log(data);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching uoms.'});
    }
}));

app.get('/api/getRecipeCategories/:recipeId', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        const id = validateId(req.params.recipeId);
        const data = await apiGet<any>(`/recipeCategory/get/${id}`, cookie);
        console.log(data);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching recipe categories.'});
    }
}));

app.get('/api/GetRecipeFromCategory/:id', async (req, res) => {

    const id = validateId(req.params.id);

    if (id === null) {
        return res.status(400).json({error: "Invalid category ID."});
    }

    try {
        const data = await apiGet<any>(`/recipe/get/category/${id}`);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while getting recipes from category.'});
    }
});

app.get('/api/GetFullRecipe/:id', async (req, res) => {
    const id = validateId(req.params.id);

    if (id === null) {
        return res.status(400).json({error: "Invalid recipe ID."});
    }
    try {
        const data = await apiGet<any>(`/recipe/getfull/${id}`);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching recipe.'});
    }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.listen(PORT, async () => {
    await loginWithRetry();
    console.log(`Proxy listening on port ${PORT}`);
});

async function loginWithRetry(intervalMs = 5000): Promise<void> {
    let loggedIn = false;
    while (!loggedIn) {
        console.log('Attempting default login...');
        loggedIn = await loginDefault();
        if (!loggedIn) {
            console.warn(`Login failed. Retrying in ${intervalMs / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }
}

app.post('/api/saveRecipe', sessionRouteWrapper(async (cookie, req, res) => {
    const recipe = req.body;

    if (!recipe || !recipe.recipe || typeof recipe.recipe.recipe.id !== 'number') {
        return res.status(400).json({error: 'Invalid recipe object.'});
    }

    return await apiRequest<any>('/fullRecipe/create', recipe, cookie);
}));

app.post('/api/saveRecipeCategories', sessionRouteWrapper(async (cookie, req, res) => {
    const recipeCategory = req.body;
    // console.log("Received data: ", req.body);
    return await apiRequest<any>('/recipeCategory/create', recipeCategory, cookie);
}));

app.get('/api/deleteRecipe/:id', sessionRouteWrapper(async (cookie, req, res) => {
    const id = validateId(req.params.id);
    if (id === null) {
        return res.status(400).json({error: "Invalid recipe ID."});
    }
    try {
        const data = await apiGet<any>(`/recipe/delete/${id}`, cookie);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while deleting recipe.'});
    }
}));
