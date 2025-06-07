import router from "./roleManagement.js";
import {sessionRouteWrapper} from "../../utils/sessionRouterWrapper.js";
import {apiGet, apiRequest} from "../../utils/apiHelpers.js";
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

export default router