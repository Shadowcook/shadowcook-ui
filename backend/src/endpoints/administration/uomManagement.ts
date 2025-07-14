import express from "express";

const router = express.Router();

// router.get('/getActiveUom', sessionRouteWrapper(async (cookie, req, res) => {
//     console.log('Getting all active uoms for this instance');
//     const data = await apiGet<any>('/uom/get/true', cookie);
//     console.log("retrieved data for active uoms: ", data);
//     res.json(data);
// }));
//
// router.post('/pushUom', sessionRouteWrapper(async (cookie, req, res) => {
//     const rq = req.body;
//     console.log("UOM Request: ", rq);
//     if (!rq) {
//         console.error("Did not receive a UOM object.");
//         return res.status(400).json({error: 'Invalid uom object.'});
//     }
//     return await apiRequest<any>('/uom/create', rq, cookie);
// }));

export default router;
