import {RecipeHeader} from "./recipeHeader.ts";
import {RecipeStep} from "./recipeStep.ts";

export interface Recipe {
    recipe: RecipeHeader;
    steps: RecipeStep[];
}