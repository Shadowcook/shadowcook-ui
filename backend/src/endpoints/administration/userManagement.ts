import router from "./roleManagement.js";
import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import {apiGet, apiGetFull, apiRequest} from "../../utils/apiHelpers.js";
import {isValidId} from "../../utils/validate.js";

router.get('/getAllUsers', sessionRouteWrapper(async (cookie, req, res) => {
    console.log('Getting all users for this instance');
    const data = await apiGet<any>('/user/get', cookie);
    console.log("retrieved data for users: ", data);
    res.json(data);
}));

router.get('/getUserRoles/:userId', sessionRouteWrapper(async (cookie, req, res) => {

    try {
        if (isValidId(req.params.userId)) {
            const id = Number(req.params.userId);
            const data = await apiGet<any>(`/userRole/get/${id}`, cookie);
            console.log(data);
            res.json(data);
        }
    } catch {
        res.status(500).json({error: 'Error while getting user roles.'});
    }
}));

router.post('/saveUser', sessionRouteWrapper(async (cookie, req, res) => {
    const userRequest = req.body;
    console.log("UserRequest: ", userRequest);
    if (!userRequest) {
        console.error("userRequest not found");
        return res.status(400).json({error: 'Invalid user object.'});
    }
    return await apiRequest<any>('/user/create', userRequest, cookie);
}));

router.post('/pushUserRoles', sessionRouteWrapper(async (cookie, req, res) => {
    const userRoleRequest = req.body;

    if (!userRoleRequest) {
        return res.status(400).json({error: 'Invalid user role object.'});
    }

    return await apiRequest<any>('/userRole/create', userRoleRequest, cookie);
}));

router.post('/pushUser', sessionRouteWrapper(async (cookie, req, res) => {
    const user = req.body;

    if (!user) {
        return res.status(400).json({error: 'Invalid user object.'});
    }
    console.log("Pushing user: ", user);
    return await apiRequest<any>('/user/create', user, cookie);
}));

router.get('/deleteUserRole/:userId', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        if (isValidId(req.params.userId)) {
            const id = Number(req.params.userId);
            const data = await apiGet<any>(`/userRole/delete/${id}`, cookie);
            console.log(data);
            res.json(data);
        }
    } catch {
        res.status(500).json({error: 'Error while deleting user roles.'});
    }
}));

router.get('/userPasswordReset/:userid', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        console.log("Creating user password reset");
        const userid = req.params.userid;

        const response = await apiGetFull<any>(`/user/resetPasswordCreate/${userid}`, cookie);
        console.log(response);
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in triggering password reset: ${e}`)
        res.status(500).json({error: 'Internal server error while triggering password reset'});
    }
}));

router.get('/deleteUser/:userid', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        console.log("Deleting user");
        const userid = req.params.userid;

        const response = await apiGetFull<any>(`/user/delete/${userid}`, cookie);
        console.log(response);
        res.json(response.data);
    } catch (e) {
        console.log(`API ERROR in deleting user: ${e}`)
        res.status(500).json({error: 'Internal server error while deleting user'});
    }
}));



export default router