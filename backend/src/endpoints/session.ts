import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";
import {config} from '../config.js';
import axios from "axios";

const router = express.Router();

router.get('/session/validate', sessionRouteWrapper({
    configFactory: () => ({
        method: 'GET',
        url: '/auth/validate',
    }),
    transformResponse: (data, req) => {
        if (data.session?.user?.login === config.username) {
            return {
                session: {
                    valid: false,
                    user: {
                        active: false,
                        email: '',
                        id: -1,
                        login: '',
                        passwordResetExpiry: ''
                    },
                    accesses: [],
                    roles: [],
                }
            };
        }
        return data;
    }
}));


router.get('/logout', sessionRouteWrapper(() => ({
    method: 'GET',
    url: '/auth/logout',
})));

router.get('/login/:username/:password', async (req, res) => {
    const {username, password} = req.params;

    try {
        const response = await axios.get(`${config.baseUrl}/auth/login/${username}/${password}`, {
            withCredentials: true,
        });

        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            res.setHeader('Set-Cookie', setCookieHeader);
        }
        console.log("User tried to login: ", response.data);
        res.json(response.data);
    } catch (err) {
        console.error('Login failed:', err);
        res.status(401).json({error: 'Login failed'});
    }
});

router.get('/refresh', async (req, res) => {
    try {
        const cookie = req.headers.cookie;
        console.log("Sending cookie for session: ", cookie);
        const response = await axios.get(`${config.baseUrl}/auth/refresh`, {
            withCredentials: true,
            headers: {
                ...(cookie ? {Cookie: cookie} : {}),
            },
        });

        const setCookie =
            response.headers?.['set-cookie'] ?? response.headers?.['Set-Cookie'];
        console.log("Refresh cookie for session: ", setCookie);
        console.log("Refresh-Response: ", response);
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }

        res.json(response.data);
    } catch (err) {
        console.error('Refresh failed:', err);
        res.status(401).json({error: 'Refresh failed'});
    }
});


router.get('/validateUserToken/:username/:token', sessionRouteWrapper(req => {
    const username = req.params.username;
    const token = req.params.token;
    return {
        method: 'GET',
        url: `/user/validateToken/${username}/${token}`,
    };
}));

router.get('/resetUserPassword/:username/:token/:base64Password', async (req, res) => {
    const username = req.params.username;
    const token = req.params.token;
    const base64Password = req.params.base64Password;

    return {
        method: 'GET',
        url: `/user/resetPassword/${username}/${token}/${base64Password}`,
    };
});

export default router;