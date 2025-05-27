import React from "react";
import {Recipe} from "../types/recipe.ts";
import "./RecipeCard.css";

interface RecipeCardEditProps {
    recipe: Recipe | null;
    setRecipe: (recipe: Recipe) => void;
}


export const RecipeCardEdit: React.FC<RecipeCardEditProps>
    = (props) => {
    const {recipe, setRecipe} = props;

    function updateRecipeField<K extends keyof Recipe['recipe']>(
        field: K,
        value: Recipe['recipe'][K]
    ) {
        if (!recipe) return;
        setRecipe({
            ...recipe,
            recipe: {
                ...recipe.recipe,
                [field]: value,
            },
        });
    }

    if (recipe !== null) {


        return (
            <>
                <div className="recipeTitleFrame">
                    <input
                        type="text"
                        className="recipeTitle recipeTitleInput"
                        value={recipe.recipe.name}
                        onChange={(e) => updateRecipeField("name", e.target.value)}
                    />
                </div>
                <div className="recipeDescriptionFrame">
                    <textarea
                        className="recipeDescription recipeDescriptionInput"
                        value={recipe.recipe.description}
                        onChange={(e) => updateRecipeField("description", e.target.value)}
                    />
                </div>
                <div className="recipeStepsFrame">
                    <table>
                        <tbody>
                        {recipe.steps.map((step, index) => (
                            <tr key={index}>
                                <td className="stepIngredient">
                                    {/*{step.ingredients.map((ing, i) => (*/}
                                    {/*    <p key={i}>{renderIngredient(ing, index)}</p>*/}
                                    {/*))}*/}
                                </td>
                                <td className="stepDescription">
                                    <p>{step.description.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            <br/>
                                        </React.Fragment>
                                    ))}</p>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    } else {
        return <div>No recipe selected</div>
    }
}