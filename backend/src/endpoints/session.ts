import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet, apiGetFull} from "../utils/apiHelpers.js";

const router = express.Router();

router.get('/session/validate', sessionRouteWrapper(async (cookie, req, res) => {
    const data = await apiGet<any>('/auth/validate', cookie);
    console.log('Validated with cookie:', cookie);
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
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
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