import {Recipe} from "./recipe.ts";
import {StepIngredient} from "./stepIngredient.ts";

export function createEmptyRecipe(): Recipe {
    return {
        recipe: {
            id: -1,
            name: "",
            description: "",
            thumbnail: "",
        },
        steps: [
            {
                order: 1,
                description: "",
                ingredients: [
                    {
                        name: "",
                        uom: {id: 0, name: ""},
                        value: 0,
                        order: 1,
                    } as StepIngredient
                ]
            }
        ]
    };
}
