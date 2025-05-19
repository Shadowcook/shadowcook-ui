import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import axios, {AxiosInstance} from 'axios';
import {CookieJar} from 'tough-cookie';
import {wrapper} from 'axios-cookiejar-support';
import cors from 'cors';
import {LoginResponse} from './types.js';
import {validateId} from "./validate.js";

const BASE_URL = process.env.BASE_URL ?? '';
const USERNAME = process.env.SC_USER ?? '';
const PASSWORD = process.env.SC_PASS ?? '';

console.log(`Using endpoint: ${BASE_URL}`)

const jar = new CookieJar();
const client: AxiosInstance = wrapper(axios.create({
    baseURL: BASE_URL,
    jar,
    withCredentials: true,
}));

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // oder '*' für dev
    credentials: true
}));
// 🔐 Login-Funktion
async function login(): Promise<boolean> {
    try {
        const loginUrl = `/auth/login/${USERNAME}/${PASSWORD}`;
        const response = await client.get<LoginResponse>(loginUrl);
        const data = response.data;

        if (!data.success) {
            console.error('Login failed.');
            if (data.messages?.length) {
                data.messages.forEach((msg, i) => {
                    console.error(`  [${i + 1}] ${msg}`);
                });
            }
            return false;
        }

        console.log('Login successful. Session:', data.session);
        return true;

    } catch (err) {
        console.error('Login error:', (err as Error).message);
        return false;
    }
}

// 🔄 Wrapper für Shadowcook-POST-Calls mit Auto-Re-Login
async function apiRequest<T>(endpoint: string, body = {}): Promise<T> {
    try {
        let response = await client.post<T>(endpoint, body);

        const responseData: any = response.data;
        if (responseData?.errorCode === 401) {
            console.warn('Session expired. Trying to login again...');
            const success = await login();
            if (success) {
                response = await client.post<T>(endpoint, body);
            } else {
                throw new Error('Login failed.');
            }
        }

        return response.data;
    } catch (err) {
        console.error('API Error:', (err as Error).message);
        throw err;
    }
}


app.get('/api/login/:username/:password', async (req, res) => {
    try {
        const username = req.params.username;
        const password = req.params.password;
        const data = await apiRequest<any>(`/auth/login/${username}/${password}`);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching categories.'});
    }
});

app.get('/api/getAllCategories', async (req, res) => {
    try {
        const data = await apiRequest<any>('/category/getFull');
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching categories.'});
    }
});

app.get('/api/GetRecipeFromCategory/:id', async (req, res) => {

    const id = validateId(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Invalid category ID." });
    }

    try {
        const data = await apiRequest<any>(`/recipe/get/category/${id}`);
        res.json(data);
    } catch {
        res.status(500).json({ error: 'Error while getting recipes from category.' });
    }
});

app.get('/api/GetFullRecipe/:id', async (req, res) => {
    const id = validateId(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: "Invalid recipe ID." });
    }
    try {
        const data = await apiRequest<any>(`/recipe/getfull/${id}`);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching recipe.'});
    }
});

// 🔁 Serverstart mit Login
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.listen(PORT, async () => {
    console.log(`Backend proxy started on port ${PORT}`);
    const success = await login();
    if (!success) {
        console.error('Initial login failed. API calls will fail.');
    }
});
