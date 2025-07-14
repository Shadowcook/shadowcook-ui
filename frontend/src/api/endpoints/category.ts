import {RecipeCategory} from "../../types/category/recipeCategory.ts";
import {RecipeCategoryResponse} from "../../types/category/recipeCategoryResponse.ts";
import {Category} from "../../types/category/category.ts";
import {CategoriesResponse} from "../../types/category/categoriesResponse.ts";
import {apiGet} from "@api/apiRequest.ts";

export async function fetchRecipeCategories(recipeId: number): Promise<RecipeCategory[]> {
    try {
        console.log("fetching recipe categories");
        const res = await apiGet<RecipeCategoryResponse>(`/getRecipeCategories/${recipeId}`);
        console.log(`fetched recipe categories: ${res.recipeCategory.length}`);
        return res.recipeCategory;
    } catch (error) {
        console.log(error);
    }
    return [];
}


export async function fetchCategories(): Promise<Category[]> {
    console.log("fetching categories");
    const res = await apiGet<CategoriesResponse>('/getAllCategories');
    console.log("fetched categories: ", res);
    console.log("fetched " + res.length + " categories");
    return res.categories;
}