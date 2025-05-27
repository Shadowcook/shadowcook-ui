import style from "./RecipeView.module.css";
import React, {type JSX} from "react";
import {StepIngredient} from "../types/stepIngredient.ts";
import {Recipe} from "../types/recipe.ts";

interface RecipeCardReadProps {
    recipe: Recipe;
}

function renderIngredient(ing: StepIngredient, key: number): JSX.Element {
    let content;
    if (ing.uom.id > 0) {
        content = (
            <span className={style.ingredient}>{ing.value} {ing.uom.name} {ing.name}</span>
        );
    } else {
        switch (ing.uom.id) {
            case 0:
                content = (
                    <span className={style.ingredientWorkStepGeneric}>{ing.name}</span>
                );
                break;
            default:
                content = (
                    <span className={style.ingredientWorkStepUndefined}>{ing.name}</span>
                );
        }
    }
    return <p key={key}>{content}</p>;
}

export const RecipeCardRead: React.FC<RecipeCardReadProps>
    = (props) => {
    const recipe = props.recipe;
    return (
        <div>
            <div className={style.recipeTitleFrame}>
                <span className={style.recipeTitle}>{recipe.recipe.name}</span>
            </div>
            <div className={style.recipeDescriptionFrame}>
                <span className={style.recipeDescription}>{recipe.recipe.description}</span>
            </div>
            <div className={style.recipeStepsFrame}>
                <table>
                    <tbody>
                    {recipe.steps.map((step, index) => (
                        <tr key={index}>
                            <td className={style.stepIngredient}>
                                {step.ingredients.map((ing, i) => (
                                    <p key={i}>{renderIngredient(ing, index)}</p>
                                ))}
                            </td>
                            <td className={style.stepDescription}>
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
        </div>
    )
}