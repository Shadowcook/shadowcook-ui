import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import {apiGet, apiRequest} from "../../utils/apiHelpers.js";
import express from "express";
import {isValidId} from "../../utils/validate.js";

const router = express.Router();

router.post('/pushCategory', sessionRouteWrapper(async (cookie, req, res) => {
    const rq = req.body;
    console.log("Category Request: ", rq);
    if (!rq) {
        console.error("categoryRequest not found");
        return res.status(400).json({error: 'Invalid category object.'});
    }
    return await apiRequest<any>('/category/create', rq, cookie);
}));

router.get('/deleteCategory/:delCatId', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        if (isValidId(req.params.delCatId)) {
            const delId = Number(req.params.delCatId);
            if (delId <= 1) {
                res.status(500).json({error: 'You can not delete the root category'});
            } else {
                const data = await apiGet<any>(`/category/delete/${delId}`, cookie);
                console.log(data);
                res.json(data);
            }
        }
    } catch {
        res.status(500).json({error: 'Error while deleting accesses.'});
    }
}));

export default router