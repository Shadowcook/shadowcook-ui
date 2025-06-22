import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet, apiGetFull} from "../utils/apiHelpers.js";
import {config} from '../config.js';

const router = express.Router();

router.get('/session/validate', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Cookie received in validateSession:', cookie);
    const data = await apiGet<any>('/auth/validate', cookie);


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
    } else {
        console.log('Validated with cookie: ', cookie);
    }
    return data;
}));

router.get('/logout', sessionRouteWrapper(async (cookie, req, res) => {
    const data = await apiGet<any>('/auth/logout', cookie);
    console.log(data);
    res.setHeader('Set-Cookie', [
        'activeSession=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    ]);
    return data;
}));

router.get('/login/:username/:password', async (req, res) => {
    try {
        const username = req.params.username;
        const password = req.params.password;
        const response = await apiGetFull<any>(`/auth/login/${username}/${password}`);
        console.log(response);
        const setCookie = response.headers['set-cookie'];
        if (Array.isArray(setCookie)) {
            console.log("array cookie set: ", setCookie);
            res.setHeader('Set-Cookie', setCookie);
        } else if (setCookie) {
            console.log("single cookie set: ", [setCookie]);
            res.setHeader('Set-Cookie', [setCookie]);
        } else {
            console.log("Unknown cookie: ", setCookie);
        }
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in user login: ${e}`)
        res.status(500).json({error: 'Internal server error while login'});
    }
});

router.get('/validateUserToken/:username/:token', async (req, res) => {
    try {
        const username = req.params.username;
        const token = req.params.token;
        const response = await apiGetFull<any>(`/user/validateToken/${username}/${token}`);
        console.log(response);
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in token validation: ${e}`)
        res.status(500).json({error: 'Internal server error while validating token'});
    }
});

router.get('/resetUserPassword/:username/:token/:base64Password', async (req, res) => {
    try {
        const username = req.params.username;
        const token = req.params.token;
        const base64Password = req.params.base64Password;
        const response = await apiGetFull<any>(`/user/resetPassword/${username}/${token}/${base64Password}`);
        console.log(response);
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in resetting password: ${e}`)
        res.status(500).json({error: 'Internal server error while resetting password'});
    }
});

export default router;