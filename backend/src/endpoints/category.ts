import {sessionRouteWrapper} from "../utils/sessionRouterWrapper.js";
import {isValidId} from "../utils/validate.js";
import express from "express";


const router = express.Router();


router.get('/getAllCategories', sessionRouteWrapper(() => ({
    method: 'GET',
    url: '/category/getFull',
})));


router.get('/getRecipeCategories/:recipeId', sessionRouteWrapper(req => {
    const id = req.params.recipeId;

    if (!isValidId(id)) {
        throw new Error('Invalid recipe ID');
    }
    return {
        method: 'GET',
        url: `/recipeCategory/get/${id}`,
    };
}));


router.get('/GetRecipeFromCategory/:id', sessionRouteWrapper(req => {
    const id = req.params.id;
    // console.log(({id: id, param: req.params.id}));
    if (!isValidId(id)) {
        throw new Error('Invalid recipe ID');
    }
    return {
        method: 'GET',
        url: `/recipe/get/category/${id}`,
    };
}));

export default router;