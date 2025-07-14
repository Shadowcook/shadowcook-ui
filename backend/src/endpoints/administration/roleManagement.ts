import express from "express";


const router = express.Router();


// router.get('/getAllRoles', sessionRouteWrapper(async (cookie, req, res) => {
//     console.log('Getting all roles for this instance');
//     const data = await apiGet<any>('/role/get', cookie);
//     console.log("retrieved data for roles: ", data);
//     res.json(data);
// }));
//
// router.get('/getAllRoleAccess', sessionRouteWrapper(async (cookie, req, res) => {
//     console.log('Getting all roles for this instance');
//     const data = await apiGet<any>('/roleAccess/get', cookie);
//     console.log("retrieved access for roles: ", data);
//     res.json(data);
// }));
//
// router.get('/getAllAccessIDs', sessionRouteWrapper(async (cookie, req, res) => {
//     console.log('Getting all access IDs for this instance');
//     const data = await apiGet<any>('/access/get', cookie);
//     console.log("retrieved data for access IDs: ", data);
//     res.json(data);
// }));
//
// router.post('/saveRole', sessionRouteWrapper(async (cookie, req, res) => {
//     const rolesRequest = req.body;
//     console.log("RoleRequest: ", rolesRequest);
//     if (!rolesRequest) {
//         console.error("rolesRequest not found");
//         return res.status(400).json({error: 'Invalid role object.'});
//     }
//     return await apiRequest<any>('/role/create', rolesRequest, cookie);
// }));
//
// router.post('/saveAccess', sessionRouteWrapper(async (cookie, req, res) => {
//     const accessRequest = req.body;
//     console.log("AccessRequest: ", accessRequest);
//     if (!accessRequest) {
//         console.error("accessRequest not found");
//         return res.status(400).json({error: 'Invalid access object.'});
//     }
//     return await apiRequest<any>('/roleAccess/create', accessRequest, cookie);
// }));
//
// router.get('/deleteRoleAccess/:roleId', sessionRouteWrapper(async (cookie, req, res) => {
//     try {
//         if (isValidId(req.params.roleId)) {
//             const id = req.params.roleId;
//             const data = await apiGet<any>(`/roleAccess/delete/${id}`, cookie);
//             console.log(data);
//             res.json(data);
//         }
//     } catch {
//         res.status(500).json({error: 'Error while deleting accesses.'});
//     }
// }));
//
// router.get('/deleteRole/:roleId', sessionRouteWrapper(async (cookie, req, res) => {
//     try {
//         if (isValidId(req.params.roleId)) {
//             const id = Number(req.params.roleId);
//             const data = await apiGet<any>(`/role/delete/${id}`, cookie);
//             console.log(data);
//             res.json(data);
//         }
//     } catch {
//         res.status(500).json({error: 'Error while deleting accesses.'});
//     }
// }));

export default router