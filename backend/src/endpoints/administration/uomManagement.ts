import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import {apiGet, apiGetFull, apiRequest} from "../../utils/apiHelpers.js";
import {isValidId} from "../../utils/validate.js";
import express from "express";

const router = express.Router();

router.get('/getActiveUom', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all active uoms for this instance');
    const data = await apiGet<any>('/uom/get/true', cookie);
    console.log("retrieved data for active uoms: ", data);
    res.json(data);
}));

export default router;
