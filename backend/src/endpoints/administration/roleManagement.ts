import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet} from "../../utils/apiHelpers.js";

const router = express.Router();


router.get('/getAllRoles', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all roles for this instance');
    return await apiGet<any>('/role/get', cookie);
}));