import {ApiResponse} from "../apiResponse.ts";
import {RecipeHeader} from "./recipeHeader.ts";

export interface RecipeListResponse extends ApiResponse<RecipeHeader[]> {
    recipes: RecipeHeader[];
}