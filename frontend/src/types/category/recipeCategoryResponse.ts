import {ApiResponse} from "../apiResponse.ts";
import {RecipeCategory} from "./recipeCategory.ts";


export interface RecipeCategoryResponse extends ApiResponse<RecipeCategory[]> {
    recipeCategory: RecipeCategory[];
}