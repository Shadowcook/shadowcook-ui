import apiClient from './axios';
import {Category} from "../types/category.ts";
import {RecipeHeader} from "../types/recipeHeader.ts";
import {CategoriesResponse} from "../types/categoriesResponse.ts";
import {RecipeListResponse} from "../types/recipeListResponse.ts";
import {RecipeResponse} from "../types/recipeResponse.ts";
import {Recipe} from "../types/recipe.ts";
import {AuthResponse} from "../types/authResponse.ts";
import {SessionValidationResponse} from "../types/sessionValidationResponse.ts";

export async function fetchCategories(): Promise<Category[]> {
    console.log("fetching categories");
    const res = await apiClient.get<CategoriesResponse>('/getAllCategories');
    console.log("fetched " + res.data.length + " categories");
    return res.data.categories;
}

export async function validateLogin(): Promise<SessionValidationResponse> {
    console.log("Validating session");
    const res = await apiClient.get<SessionValidationResponse>('/session/validate');
    console.log('validateLogin → /session/validate responded with: ', res.data);
    return res.data;
}

export async function logout(): Promise<SessionValidationResponse> {
    console.log("Logging out of session");
    const res = await apiClient.get<SessionValidationResponse>('/logout');
    return res.data;
}

export async function loginUser(username: string, password: string): Promise<AuthResponse | null> {
    if (username != null && password != null) {
        const res = await apiClient.get<AuthResponse>(`/login/${username}/${password}`);
        return res.data;
    } else {
        return null;
    }
}

export async function fetchRecipeList(categoryId: number): Promise<RecipeHeader[]> {
    if (categoryId != null) {
        console.log(`fetching recipes for category ${categoryId}`);
        const res = await apiClient.get<RecipeListResponse>(`/GetRecipeFromCategory/${categoryId}`);
        console.log("fetched " + res.data.length + " recipes");
        return res.data.recipes;
    } else {
        return [];
    }
}

export async function fetchRecipe(recipeId: number): Promise<Recipe | null> {
    if (recipeId != null) {
        console.log(`fetching recipes with id ${recipeId}`);
        const res = await apiClient.get<RecipeResponse>(`/GetFullRecipe/${recipeId}`);
        if (Array.isArray(res.data.recipes) && res.data.recipes.length > 0) {
            return res.data.recipes[0];
        }
    }
    console.log("API call did not contain any recipe");
    return null;
}