import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import {isValidId} from "../utils/validate.js";
import express from "express";
import {apiGet} from "../utils/apiHelpers.js";


const router = express.Router();

router.get('/getAllCategories', async (req, res) => {
    try {
        const data = await apiGet<any>('/category/getFull');
        res.json(data);
    } catch {
        res.status(500).json({error: 'Error while fetching categories.'});
    }
});

router.get('/getRecipeCategories/:recipeId', sessionRouteWrapper(async (cookie, req, res) => {
    try {
        if (isValidId(req.params.recipeId)) {
            const id = req.params.recipeId;
            const data = await apiGet<any>(`/recipeCategory/get/${id}`, cookie);
            console.log(data);
            res.json(data);
        }
    } catch {
        res.status(500).json({error: 'Error while fetching recipe categories.'});
    }
}));

router.get('/GetRecipeFromCategory/:id', async (req, res) => {

    if (isValidId(req.params.id)) {
        const id = req.params.id;

        if (id === null) {
            return res.status(400).json({error: "Invalid navigation ID."});
        }

        try {
            const data = await apiGet<any>(`/recipe/get/category/${id}`);
            res.json(data);
        } catch {
            res.status(500).json({error: 'Error while getting recipes from navigation.'});
        }
    }
});

export default router;