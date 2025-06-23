import React, {type JSX, useEffect, useState} from "react";
import {StepIngredient} from "@project-types/recipe/stepIngredient.ts";
import {Recipe} from "@project-types/recipe/recipe.ts";
import "./RecipeCard.css";
import {fetchRecipeHeadersByIds} from "@api";
import {RecipeHeader} from "@project-types/recipe/recipeHeader.ts";
import importantIcon from "@assets/font-awesome/solid/triangle-exclamation.svg";
import infoIcon from "@assets/font-awesome/solid/circle-info.svg";
import heatIcon from "@assets/font-awesome/solid/fire-burner.svg";
import waitIcon from "@assets/font-awesome/solid/clock.svg";
import cookIcon from "@assets/font-awesome/solid/spoon.svg";
import coolIcon from "@assets/font-awesome/solid/snowflake.svg";
import addIcon from "@assets/font-awesome/solid/plus.svg";
import removeIcon from "@assets/font-awesome/solid/minus.svg";
import defaultIcon from "@assets/font-awesome/solid/screwdriver-wrench.svg";

import style from "./RecipeCardRead.module.css";

interface RecipeCardReadProps {
    recipe: Recipe;
}

function extractRecipeIdsFromRecipe(recipe: Recipe): number[] {
    const regex = /\{recipeId:(\d+)\}/g;
    const ids = new Set<number>();

    for (const step of recipe.steps) {
        const lines = step.description.split('\n');
        for (const line of lines) {
            let match: RegExpExecArray | null;
            while ((match = regex.exec(line)) !== null) {
                ids.add(parseInt(match[1], 10));
            }
        }
    }

    return [...ids];
}

function renderIngredient(ing: StepIngredient, key: number): JSX.Element {
    let content;
    if (ing.uom.id > 0) {
        content = (
            <span className="ingredient">{ing.value} {ing.uom.name} {ing.name}</span>
        );
    } else {
        let uomIcon;
        let uomAltName: string = "";
        switch (ing.uom.id) {
            case -8:
                uomIcon = removeIcon;
                uomAltName = "Remove";
                break;
            case -7:
                uomIcon = addIcon;
                uomAltName = "Add";
                break;
            case -6:
                uomIcon = infoIcon;
                uomAltName = "Info";
                break;
            case -5:
                uomIcon = importantIcon;
                uomAltName = "Important";
                break;
            case -4:
                uomIcon = cookIcon;
                uomAltName = "Cook";
                break;
            case -3:
                uomIcon = coolIcon;
                uomAltName = "Cool";
                break;
            case -2:
                uomIcon = heatIcon;
                uomAltName = "Heat";
                break;
            case -1:
                uomIcon = waitIcon;
                uomAltName = "Wait";
                break;

            case 0:
                uomIcon = defaultIcon;
                uomAltName = "Work step";
                break;
        }
        content = (
            <div className={style.ingredientWorkStepFrame}>
                {uomIcon ? <img className={style.ingredientIcon} src={uomIcon} alt={uomAltName}/> : " "}
                <span className={style.ingredientWorkStepGeneric}>{ing.name}</span>
            </div>
        );
    }

    return <p key={key}>{content}</p>;
}


export const RecipeCardRead: React.FC<RecipeCardReadProps>
    = (props) => {
    const recipe = props.recipe;
    const [recipeMap, setRecipeMap] = useState<Record<number, RecipeHeader>>({});

    useEffect(() => {
        const ids = extractRecipeIdsFromRecipe(recipe);
        if (ids.length > 0) {
            fetchRecipeHeadersByIds(ids).then((headers) => {
                const map = Object.fromEntries(headers.map(r => [r.id, r]));
                setRecipeMap(map);
            });
        }
    }, [recipe]);

    function renderRecipeLink(line: string) {
        const parts = line.split(/(\{recipeId:\d+\})/g);
        return parts.map((part, index) => {
            const match = part.match(/\{recipeId:(\d+)\}/);
            if (match) {
                const id = parseInt(match[1], 10);
                const recipe = recipeMap[id];
                if (recipe) {
                    return (
                        <a key={index} href={`/recipe/${id}`}>
                            {recipe.name}
                        </a>
                    );
                } else {
                    return <span key={index}>{`[Unbekanntes Rezept: ${id}]`}</span>;
                }
            }
            return <span key={index}>{part}</span>;
        });
    }

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
                            <td className="editStepIngredient">
                                {step.ingredients.map((ing, ingredientIndex) => (
                                    renderIngredient(ing, ingredientIndex)
                                ))}
                            </td>
                            <td className="editStepDescription">
                                <p>{step.description.split('\n').map((line, descriptionLineIndex) => (
                                    <React.Fragment key={`step-description-${descriptionLineIndex}`}>
                                        {renderRecipeLink(line)}
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