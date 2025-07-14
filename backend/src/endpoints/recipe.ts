import express from 'express';
import {isValidId} from '../utils/validate.js';
import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";

const router = express.Router();

router.get('/recipes', sessionRouteWrapper(() => ({
    method: 'GET',
    url: '/recipes',
})));

router.post('/recipes', sessionRouteWrapper(() => ({
    method: 'POST',
    url: '/recipes',
})));

router.post('/auth/logout', sessionRouteWrapper(() => ({
    method: 'POST',
    url: '/auth/logout',
})));

router.get('/GetFullRecipe/:id', sessionRouteWrapper(req => {
    const id = req.params.id;

    if (!isValidId(id)) {
        throw new Error('Invalid recipe ID');
    }
    return {
        method: 'GET',
        url: `/recipe/getfull/${encodeURIComponent(id)}`,
    };
}));

router.get('/GetRecipeFromString/:search', sessionRouteWrapper(req => {
    const search = req.params.search;
    return {
        method: 'GET',
        url: `/recipe/get/search/${encodeURIComponent(search)}`,
    };
}));

router.get('/GetRecipesFromIds/:ids', sessionRouteWrapper(req => {
    const ids = req.params.ids;
    return {
        method: 'GET',
        url: `/recipe/get/list/${encodeURIComponent(ids)}`,
    };
}));

router.post('/saveRecipe', sessionRouteWrapper(req => {
    const recipe = req.body;
    if (!recipe || !recipe.recipe || typeof recipe.recipe.recipe.id !== 'number') {
        throw new Error('Invalid recipe object');
    }
    return {
        method: 'POST',
        url: '/fullRecipe/create',
        data: recipe,
    };
}));

router.post('/saveRecipeCategories', sessionRouteWrapper(() => ({
    method: 'POST',
    url: '/recipeCategory/create',
})));

router.get('/deleteRecipe/:id', sessionRouteWrapper(req => {
    const id = req.params.id;
    if (!isValidId(id)) {
        throw new Error('Invalid recipe ID');
    }
    return {
        method: 'GET',
        url: `/recipe/delete/${encodeURIComponent(id)}`,
    };
}));

export default router;