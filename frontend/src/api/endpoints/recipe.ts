import {RecipeHeader} from "../../types/recipe/recipeHeader.ts";
import {RecipeListResponse} from "../../types/recipe/recipeListResponse.ts";
import {Recipe} from "../../types/recipe/recipe.ts";
import {RecipeResponse} from "../../types/recipe/recipeResponse.ts";
import {RecipeCategory} from "../../types/category/recipeCategory.ts";
import {apiGet, apiPost} from "@api/apiRequest.ts";

export async function fetchRecipeList(categoryId: number): Promise<RecipeHeader[]> {
    if (categoryId != null) {
        console.log(`fetching recipes for category ${categoryId}`);
        const res = await apiGet<RecipeListResponse>(`/GetRecipeFromCategory/${categoryId}`);
        console.log("fetched " + res.recipes.length + " recipes");
        return res.recipes;
    } else {
        return [];
    }
}

export async function fetchRecipeHeads(search: string): Promise<RecipeHeader[]> {
    if (search && search.length > 0) {
        console.log(`fetching recipes with ${search}`);
        const res = await apiGet<RecipeListResponse>(`/GetRecipeFromString/${search}`);
        console.log("fetched " + res.recipes.length + " recipes");
        return res.recipes;
    } else {
        return [];
    }
}

export async function fetchRecipe(recipeId: number): Promise<Recipe | null> {
    if (recipeId != null) {
        console.log(`fetching recipes with id ${recipeId}`);
        const res = await apiGet<RecipeResponse>(`/GetFullRecipe/${recipeId}`);
        if (Array.isArray(res.recipes) && res.recipes.length > 0) {
            return res.recipes[0];
        }
    }
    console.log("API call did not contain any recipe");
    return null;
}

export async function pushRecipe(recipe: Recipe): Promise<Recipe | null> {
    try {
        console.log("Saving recipe...", recipe);
        const res = await apiPost<RecipeResponse>('/saveRecipe', {recipe: recipe});

        console.log("Recipe saved:", res.data);
        return res.recipes[0];
    } catch (error) {
        console.error("Failed to save recipe:", error);
        return null;
    }
}


export async function pushRecipeCategories(recipeId: number, categoryIds: number[]): Promise<boolean> {
    try {

        const recipeCategories: RecipeCategory[] = categoryIds.map(catId => ({
            id: -1,
            recipe: recipeId,
            category: catId
        }));

        console.log(`Adding recipe ${recipeId} to ${recipeCategories.length} categories.`);
        const res = await apiPost<RecipeResponse>('/saveRecipeCategories', {recipeCategories});
        console.log("Recipe saved:", res);
        return true;
    } catch (error) {
        console.error("Failed to save recipe:", error);
        return false;
    }
}

export async function deleteRecipe(recipeId: number): Promise<boolean> {
    try {
        if (recipeId != null) {
            console.log(`deleting recipe with id ${recipeId}`);
            const res = await apiGet<RecipeResponse>(`/deleteRecipe/${recipeId}`);
            if (res.success) {
                return true;
            } else {
                console.error("unable to delete recipe. Response was: ", res.data);
            }
        }
    } catch (error) {
        console.log("API call did not contain any recipe: ", error);
    }
    return false;
}

export async function fetchRecipeHeadersByIds(ids: number[]): Promise<RecipeHeader[]> {
    if (ids && ids.length > 0) {
        console.log(`fetching recipe ids `, ids);
        const res = await apiGet<RecipeListResponse>(`/GetRecipesFromIds/${ids.map(id => encodeURIComponent(id)).join(',')}`);
        console.log("fetched " + res.recipes.length + " recipes");
        return res.recipes;
    } else {
        return [];
    }
}

