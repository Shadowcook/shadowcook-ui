import React from "react";
import {Recipe} from "../types/recipe.ts";
import "./RecipeCard.css";
import {StepIngredient} from "../types/stepIngredient.ts";
import {
    EditableNumberField,
    EditableTextareaField,
    EditableTextField,
    EditableUomSelect
} from "../utilities/InputFieldLibrary.tsx";
import {Uom} from "../types/uom.ts";

interface RecipeCardEditProps {
    recipe: Recipe | null;
    setRecipe: (recipe: Recipe) => void;
    uomList: Uom[];
}


export const RecipeCardEdit: React.FC<RecipeCardEditProps>
    = (props) => {
    const {recipe, setRecipe, uomList} = props;
    console.log({component: "RecipeCardEdit", function: "RecipeCardEdit", data: uomList});

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


    function updateIngredientField<K extends keyof StepIngredient>(
        stepIndex: number,
        ingIndex: number,
        field: K,
        value: StepIngredient[K]
    ) {
        if (!recipe) return;

        const updatedSteps = [...recipe.steps];
        const updatedIngredients = [...updatedSteps[stepIndex].ingredients];


        updatedIngredients[ingIndex] = {
            ...updatedIngredients[ingIndex],
            [field]: value,
        };

        updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            ingredients: updatedIngredients,
        };

        setRecipe({
            ...recipe,
            steps: updatedSteps,
        });
    }

    function updateStepDescription(index: number, value: string) {
        if (!recipe) return;
        const updatedSteps = [...recipe.steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            description: value,
        };
        setRecipe({
            ...recipe,
            steps: updatedSteps,
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
                        {recipe.steps.map((step, stepIndex) => (
                            <tr key={stepIndex}>
                                <td className="stepIngredient">
                                    {step.ingredients.map((ing, ingIndex) => (
                                        <p key={`step-row-${ingIndex}`}>
                                            <EditableNumberField
                                                value={ing.value}
                                                onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'value', val)}
                                            />
                                            {uomList.length > 0 ? (
                                                <EditableUomSelect
                                                    value={ing.uom}
                                                    options={uomList}
                                                    onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'uom', val)}
                                                    className="ingredientUomSelect"
                                                />
                                            ) : (
                                                <span>Loading...</span>
                                            )}
                                            <EditableTextField
                                                value={ing.name}
                                                onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'name', val)}
                                                className="ingredientNameInput"
                                            />
                                        </p>
                                    ))}
                                </td>
                                <td className="stepDescription">
                                    <p>

                                        <EditableTextareaField
                                            value={step.description}
                                            onChange={(val) => updateStepDescription(stepIndex, val)}
                                            className="stepDescriptionInput"
                                        />
                                    </p>
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