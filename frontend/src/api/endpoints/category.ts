import {RecipeCategory} from "../../types/category/recipeCategory.ts";
import apiClient from "../axios.ts";
import {RecipeCategoryResponse} from "../../types/category/recipeCategoryResponse.ts";
import {Category} from "../../types/category/category.ts";
import {CategoriesResponse} from "../../types/category/categoriesResponse.ts";

export async function fetchRecipeCategories(recipeId: number): Promise<RecipeCategory[]> {
    try {
        console.log("fetching recipe categories");
        const res = await apiClient.get<RecipeCategoryResponse>(`/getRecipeCategories/${recipeId}`);
        console.log(`fetched recipe categories: ${res.data.recipeCategory.length}`);
        return res.data.recipeCategory;
    } catch (error) {
        console.log(error);
    }
    return [];
}


export async function fetchCategories(): Promise<Category[]> {
    console.log("fetching categories");
    const res = await apiClient.get<CategoriesResponse>('/getAllCategories');
    console.log("fetched categories: ", res);
    console.log("fetched " + res.data.length + " categories");
    return res.data.categories;
}