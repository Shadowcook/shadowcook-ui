import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";

const router = express.Router();

router.get('/getUomList', sessionRouteWrapper(() => ({
    method: 'GET',
    url: '/uom/get/false',
})));

export default router;