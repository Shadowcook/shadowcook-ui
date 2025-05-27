import {Link, useParams} from "react-router-dom";
import {validateId} from "../utilities/validate.ts";
import type {JSX} from 'react';
import React, {useEffect, useState} from "react";
import {fetchRecipe} from "../api/api.ts";
import {Recipe} from "../types/recipe.ts";
import style from "./RecipeView.module.css"
import './Modules.css';
import {StepIngredient} from "../types/stepIngredient.ts";
import shadowCookLogo from "../assets/shadowcook._alpha.png";
import backIcon from "../assets/font-awesome/solid/turn-up.svg";

export function RecipeView() {

    const {recipeId, categoryId} = useParams();
    const catId = validateId(categoryId);
    const sanitizedRecipeId = validateId(recipeId);
    const [recipe, setRecipe] = useState<Recipe | null>();
    useEffect(() => {
        fetchRecipe(sanitizedRecipeId)
            .then(setRecipe)
            .catch((err) => console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err));
    }, [sanitizedRecipeId]);

    if (!recipe) return (
        <div className="loadingLogoFrame">
            <img src={shadowCookLogo} alt="No recipes so far in here." />
        </div>
    );

    recipe.steps.sort((a, b) => a.order - b.order);
    recipe.steps.map((step) => {
        step.ingredients.sort((a, b) => a.order - b.order);
    })


    return (
        <div className={style.recipeCard}>
            <div className={style.backButtonFrame}>
                <Link className={style.backButtonLink} to={`/category/${catId}`}>
                    <div className={style.backButton}>
                        <img src={backIcon} alt="up-arrow" /> <span>Rezeptliste</span>
                    </div>
                </Link>
            </div>
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
    );
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
