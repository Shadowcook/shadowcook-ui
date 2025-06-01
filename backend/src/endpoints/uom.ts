import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet} from "../utils/apiHelpers.js";

const router = express.Router();
router.get('/getUomList', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        const data = await apiGet<any>('/uom/get/false', cookie);
        console.log(data);
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching uoms.'});
    }
}));

export default router;