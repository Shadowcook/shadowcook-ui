import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet} from "../../utils/apiHelpers.js";

const router = express.Router();


router.get('/getAllRoles', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all roles for this instance');
    const data = await apiGet<any>('/role/get', cookie);
    console.log("retrieved data for roles: ", data);
    res.json(data);
}));

router.get('/getAllRoleAccess', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all roles for this instance');
    const data = await apiGet<any>('/roleAccess/get', cookie);
    console.log("retrieved access for roles: ", data);
    res.json(data);
}));

router.get('/getAllAccessIDs', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all access IDs for this instance');
    const data = await apiGet<any>('/access/get', cookie);
    console.log("retrieved data for access IDs: ", data);
    res.json(data);
}));

export default router