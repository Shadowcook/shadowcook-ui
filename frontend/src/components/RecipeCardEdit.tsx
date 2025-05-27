import React from "react";
import {Recipe} from "../types/recipe.ts";

interface RecipeCardEditProps {
    recipe: Recipe | null;
    setRecipe: (recipe: Recipe) => void;
}

export const RecipeCardEdit: React.FC<RecipeCardEditProps>
    = (props) => {
    const {recipe} = props;
    if (recipe !== null) {
        const recipe = props.recipe;
        return <div><span>${recipe.recipe.name}</span></div>
    } else {
        return <div></div>
    }
}