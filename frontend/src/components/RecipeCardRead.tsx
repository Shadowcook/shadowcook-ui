import React, {type JSX} from "react";
import {StepIngredient} from "../types/stepIngredient.ts";
import {Recipe} from "../types/recipe.ts";
import "./RecipeCard.css";

interface RecipeCardReadProps {
    recipe: Recipe;
}

function renderIngredient(ing: StepIngredient, key: number): JSX.Element {
    let content;
    if (ing.uom.id > 0) {
        content = (
            <span className="ingredient">{ing.value} {ing.uom.name} {ing.name}</span>
        );
    } else {
        switch (ing.uom.id) {
            case 0:
                content = (
                    <span className="ingredientWorkStepGeneric">{ing.name}</span>
                );
                break;
            default:
                content = (
                    <span className="ingredientWorkStepUndefined">{ing.name}</span>
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
            <div className="recipeTitleFrame">
                <span className="recipeTitle">{recipe.recipe.name}</span>
            </div>
            <div className="recipeDescriptionFrame">
                <span className="recipeDescription">{recipe.recipe.description}</span>
            </div>
            <div className="recipeStepsFrame">
                <table>
                    <tbody>
                    {recipe.steps.map((step, stepIndex) => (
                        <tr key={`step-row-${stepIndex}`}>
                            <td className="stepIngredient">
                                {step.ingredients.map((ing, ingredientIndex) => (
                                    renderIngredient(ing, ingredientIndex)
                                ))}
                            </td>
                            <td className="stepDescription">
                                <p>{step.description.split('\n').map((line, descriptionLineIndex) => (
                                    <React.Fragment key={`step-description-${descriptionLineIndex}`}>
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