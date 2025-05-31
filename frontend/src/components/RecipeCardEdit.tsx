import React from "react";
import {Recipe} from "../types/recipe.ts";
// import "./RecipeCard.css";
import {StepIngredient} from "../types/stepIngredient.ts";
import {
    EditableNumberField,
    EditableTextareaField,
    EditableTextField,
    EditableUomSelect
} from "../utilities/InputFieldLibrary.tsx";
import {Uom} from "../types/uom.ts";
import style from "./RecipeCardEdit.module.css";
import moveUpStep from "../assets/circle-up.svg";
import moveDownStep from "../assets/circle-down.svg";
import deleteStep from "../assets/trash-can.svg"
import deleteIngredient from "../assets/trash-can.svg"
import addStep from "../assets/plus.svg";
import addIngredient from "../assets/plus.svg";
import moveUpIngredient from "../assets/up-long.svg";
import moveDownIngredient from "../assets/down-long.svg";


// import {useMessage} from "../hooks/useMessage.ts";


interface RecipeCardEditProps {
    recipe: Recipe | null;
    setRecipe: (recipe: Recipe) => void;
    uomList: Uom[];
}


export const RecipeCardEdit: React.FC<RecipeCardEditProps>
    = (props) => {
    const {recipe, setRecipe, uomList} = props;


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

    function addStepBelow(index: number) {
        if (!recipe) return;

        const steps = [...recipe.steps];
        steps.sort((a, b) => a.order - b.order);

        const newStep = {
            order: 0,
            description: "",
            ingredients: [
                {
                    name: "",
                    value: 0,
                    uom: {id: 0, name: ""},
                    order: 1,
                },
            ],
        };


        steps.splice(index + 1, 0, newStep);

        const reindexedSteps = steps.map((step, i) => ({
            ...step,
            order: i + 1,
        }));

        setRecipe({
            ...recipe,
            steps: reindexedSteps,
        });
    }

    function removeStep(index: number) {
        if (!recipe) return;
        const steps = [...recipe.steps];
        steps.sort((a, b) => a.order - b.order);
        steps.splice(index, 1);
        const reindexedSteps = steps.map((step, i) => ({
            ...step,
            order: i + 1,
        }));

        setRecipe({
            ...recipe,
            steps: reindexedSteps,
        });
    }

    function removeIngredient(stepIndex: number, ingIndex: number) {
        if (!recipe) return;
        const updatedSteps = [...recipe.steps];
        const ingredients = [...updatedSteps[stepIndex].ingredients];
        ingredients.splice(ingIndex, 1);
        ingredients.forEach((ing, idx) => {
            ing.order = idx + 1;
        });
        updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            ingredients,
        };

        setRecipe({
            ...recipe,
            steps: updatedSteps,
        });
    }

    function addIngredientBelow(stepIndex: number, ingIndex: number) {
        if (!recipe) return;

        const updatedSteps = [...recipe.steps];
        const ingredients = [...updatedSteps[stepIndex].ingredients];

        const newIngredient = createEmptyIngredient(ingredients[ingIndex].order + 1);
        ingredients.splice(ingIndex + 1, 0, newIngredient);

        ingredients.forEach((ing, idx) => {
            ing.order = idx + 1;
        });

        updatedSteps[stepIndex] = {
            ...updatedSteps[stepIndex],
            ingredients,
        };

        setRecipe({
            ...recipe,
            steps: updatedSteps,
        });
    }

    function createEmptyIngredient(order = 1): StepIngredient {
        return {
            name: "",
            value: 0,
            uom: {id: 0, name: ""},
            order,
        };
    }

    function moveStepUp(index: number) {
        if (!recipe || index <= 0) return;

        const steps = [...recipe.steps];
        [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];

        const reindexed = steps.map((step, idx) => ({
            ...step,
            order: idx + 1,
        }));

        setRecipe({...recipe, steps: reindexed});
    }

    function moveStepDown(index: number) {
        if (!recipe || index >= recipe.steps.length - 1) return;

        const steps = [...recipe.steps];
        [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];

        const reindexed = steps.map((step, idx) => ({
            ...step,
            order: idx + 1,
        }));

        setRecipe({...recipe, steps: reindexed});
    }

    function moveIngredientUp(stepIndex: number, ingIndex: number) {
        if (!recipe || ingIndex <= 0) return;

        const steps = [...recipe.steps];
        const ingredients = [...steps[stepIndex].ingredients];
        [ingredients[ingIndex - 1], ingredients[ingIndex]] = [ingredients[ingIndex], ingredients[ingIndex - 1]];

        steps[stepIndex] = {
            ...steps[stepIndex],
            ingredients: ingredients.map((ing, i) => ({
                ...ing,
                order: i + 1
            }))
        };

        setRecipe({...recipe, steps});
    }

    function moveIngredientDown(stepIndex: number, ingIndex: number) {
        if (!recipe || ingIndex >= recipe.steps[stepIndex].ingredients.length - 1) return;

        const steps = [...recipe.steps];
        const ingredients = [...steps[stepIndex].ingredients];
        [ingredients[ingIndex], ingredients[ingIndex + 1]] = [ingredients[ingIndex + 1], ingredients[ingIndex]];

        steps[stepIndex] = {
            ...steps[stepIndex],
            ingredients: ingredients.map((ing, i) => ({
                ...ing,
                order: i + 1
            }))
        };

        setRecipe({...recipe, steps});
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
                    <table className={style.editRecipeTable}>
                        <tbody>
                        {recipe.steps.map((step, stepIndex) => (
                            <tr key={`recipe-step-${stepIndex}`}>
                                <td className={style.editStepIngredient}>
                                    {step.ingredients.map((ing, ingIndex) => (
                                        <React.Fragment key={`recipe-step-ingredient-${ingIndex}`}>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <button
                                                            className="imageButtonSmall"
                                                            onClick={() => addIngredientBelow(stepIndex, ingIndex)}
                                                        >
                                                            <img
                                                                src={addIngredient}
                                                                alt="add ingredient"
                                                            />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={recipe.steps[stepIndex].ingredients.length < 2 ? "imageButtonSmallDisabled" : "imageButtonSmall"}
                                                            disabled={recipe.steps[stepIndex].ingredients.length < 2}
                                                            onClick={() => removeIngredient(stepIndex, ingIndex)}
                                                        >
                                                            <img
                                                                src={deleteIngredient}
                                                                alt="delete ingredient"
                                                            />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <EditableNumberField
                                                            value={ing.value}
                                                            onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'value', val)}
                                                            className={style.ingredientValueInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        {uomList.length > 0 ? (
                                                            <>
                                                                <EditableUomSelect
                                                                    value={ing.uom}
                                                                    options={uomList}
                                                                    onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'uom', val)}
                                                                    className={style.ingredientUomSelect}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Loading...</span>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <EditableTextField
                                                            value={ing.name}
                                                            onChange={(val) => updateIngredientField(stepIndex, ingIndex, 'name', val)}
                                                            className={style.ingredientNameInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={recipe.steps[stepIndex].ingredients.length < 2 ? "imageButtonSmallDisabled" : "imageButtonSmall"}
                                                            disabled={recipe.steps[stepIndex].ingredients.length < 2}
                                                            onClick={() => moveIngredientUp(stepIndex, ingIndex)}
                                                        >
                                                            <img
                                                                src={moveUpIngredient}
                                                                alt="move ingredient up"
                                                            />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={recipe.steps[stepIndex].ingredients.length < 2 ? "imageButtonSmallDisabled" : "imageButtonSmall"}
                                                            disabled={recipe.steps[stepIndex].ingredients.length < 2}
                                                            onClick={() => moveIngredientDown(stepIndex, ingIndex)}
                                                        >
                                                            <img
                                                                src={moveDownIngredient}
                                                                alt="move ingredient down"
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </React.Fragment>
                                    ))}
                                </td>
                                <td className={style.editStepDescription}>

                                    <EditableTextareaField
                                        value={step.description}
                                        onChange={(val) => updateStepDescription(stepIndex, val)}
                                        className={style.editStepDescriptionInput}
                                    />

                                </td>
                                <td className={style.editStepToolbar}>
                                    <>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <button
                                                        className="imageButton"
                                                        onClick={() => addStepBelow(stepIndex)}
                                                    >
                                                        <img
                                                            src={addStep}
                                                            alt="add step"
                                                        />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className={recipe.steps.length < 2 ? "imageButtonDisabled" : "imageButton"}
                                                        disabled={recipe.steps.length < 2}
                                                        onClick={() => removeStep(stepIndex)}
                                                    >
                                                        <img
                                                            src={deleteStep}
                                                            alt="delete step"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </>
                                    <>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <button
                                                        className={recipe.steps.length < 2 ? "imageButtonDisabled" : "imageButton"}
                                                        disabled={recipe.steps.length < 2}
                                                        onClick={() => moveStepUp(stepIndex)}
                                                    >
                                                        <img
                                                            src={moveUpStep}
                                                            alt="move step up"
                                                        />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className={recipe.steps.length < 2 ? "imageButtonDisabled" : "imageButton"}
                                                        disabled={recipe.steps.length < 2}
                                                        onClick={() => moveStepDown(stepIndex)}
                                                    >
                                                        <img
                                                            src={moveDownStep}
                                                            alt="move step down"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </>
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