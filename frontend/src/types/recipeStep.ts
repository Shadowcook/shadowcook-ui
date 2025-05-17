import {StepIngredient} from "./stepIngredient.ts";

export interface RecipeStep {
    description: string;
    ingredients: StepIngredient[];
    order: number;
}