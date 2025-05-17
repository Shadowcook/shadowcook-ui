import {ApiResponse} from "./apiResponse.ts";
import {Recipe} from "./recipe.ts";

export interface RecipeResponse extends ApiResponse<Recipe[]> {
    recipes: Recipe[];
}