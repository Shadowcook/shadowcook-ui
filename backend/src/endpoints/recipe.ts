import {isValidId} from "../utils/validate.js";
import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import express from "express";
import {apiGet, apiRequest} from "../utils/apiHelpers.js";

const router = express.Router();

router.get('/GetFullRecipe/:id', async (req, res) => {
    if (isValidId(req.params.id)) {
        const id = req.params.id;

        if (id === null) {
            return res.status(400).json({error: "Invalid recipe ID."});
        }
        try {
            const data = await apiGet<any>(`/recipe/getfull/${id}`);
            res.json(data);
        } catch {
            res.status(500).json({error: 'Error while fetching recipe.'});
        }
    }
});

router.get('/GetRecipeFromString/:search', async (req, res) => {
    const search = req.params.search;
    if (search) {
        try {
            const data = await apiGet<any>(`/recipe/get/search/${encodeURIComponent(search)}`);
            res.json(data);
        } catch {
            res.status(500).json({error: 'Error while fetching recipe list from search.'});
        }
    }
});

router.get('/GetRecipesFromIds/:ids', async (req, res) => {
    const ids = req.params.ids;
    if (ids) {
        try {
            const data = await apiGet<any>(`/recipe/get/list/${ids}`);
            res.json(data);
        } catch {
            res.status(500).json({error: 'Error while fetching recipes from id list.'});
        }
    }
});


router.post('/saveRecipe', sessionRouteWrapper(async (cookie, req, res) => {
    const recipe = req.body;

    if (!recipe || !recipe.recipe || typeof recipe.recipe.recipe.id !== 'number') {
        return res.status(400).json({error: 'Invalid recipe object.'});
    }

    return await apiRequest<any>('/fullRecipe/create', recipe, cookie);
}));

router.post('/saveRecipeCategories', sessionRouteWrapper(async (cookie, req, res) => {
    const recipeCategory = req.body;
    // console.log("Received data: ", req.body);
    return await apiRequest<any>('/recipeCategory/create', recipeCategory, cookie);
}));

router.get('/deleteRecipe/:id', sessionRouteWrapper(async (cookie, req, res) => {

    if (isValidId(req.params.id)) {
        const id = req.params.id;
        if (id === null) {
            return res.status(400).json({error: "Invalid recipe ID."});
        }
        try {
            const data = await apiGet<any>(`/recipe/delete/${id}`, cookie);
            res.json(data);
        } catch {
            res.status(500).json({error: 'Error while deleting recipe.'});
        }
    }
}));

export default router