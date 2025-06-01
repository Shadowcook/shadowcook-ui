import {ApiResponse} from "./apiResponse.ts";
import {Recipe} from "./recipe.ts";
import {Uom} from "./uom.ts";

export interface UomResponse extends ApiResponse<Recipe[]> {
    uoms: Uom[];
}