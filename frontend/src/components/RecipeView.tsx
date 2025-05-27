import {Link, useParams} from "react-router-dom";
import {validateId} from "../utilities/validate.ts";
import {fetchRecipe} from "../api/api.ts";
import {Recipe} from "../types/recipe.ts";
import style from "./RecipeView.module.css"
import './Modules.css';
import shadowCookLogo from "../assets/shadowcook._alpha.png";
import backIcon from "../assets/turn-up.svg";
import {RecipeCardRead} from "./RecipeCardRead.tsx";
import {useEffect, useState} from "react";
import editImg from "../assets/pen.svg"
import deleteImg from "../assets/trash-can.svg"
import saveImg from "../assets/floppy-disk.svg"
import cancelImg from "../assets/circle-xmark.svg"
import {RecipeCardEdit} from "./RecipeCardEdit.tsx";

export function RecipeView() {

    const {recipeId, categoryId} = useParams();
    const catId = validateId(categoryId);
    const sanitizedRecipeId = validateId(recipeId);
    const [recipe, setRecipe] = useState<Recipe | null>();
    const [editMode, setEditMode] = useState(false);
    const [editableRecipe, setEditableRecipe] = useState<Recipe | null>(null);


    useEffect(() => {
        fetchRecipe(sanitizedRecipeId)
            .then(setRecipe)
            .catch((err) => console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err));
    }, [sanitizedRecipeId]);

    useEffect(() => {
        if (recipe) setEditableRecipe(structuredClone(recipe));
    }, [recipe]);

    if (!recipe) return (
        <div className="loadingLogoFrame">
            <img src={shadowCookLogo} alt="No recipes so far in here."/>
        </div>
    );

    recipe.steps.sort((a, b) => a.order - b.order);
    recipe.steps.map((step) => {
        step.ingredients.sort((a, b) => a.order - b.order);
    })

    let toolbox;

    if (editMode) {
        toolbox = (
            <>
                <button
                    className="shadowButton"
                    onClick={() => setEditMode(false)}
                >
                    <img
                        src={cancelImg}
                        alt="Cancel"
                    />
                </button>
                <button className="shadowButton">
                    <img
                        src={saveImg}
                        alt="Save"
                    />
                </button>
                <button className="shadowButton">
                    <img
                        src={deleteImg}
                        alt="Delete"
                    />
                </button>
            </>
        );
    } else {
        toolbox = (
            <>
                <button
                    className="shadowButton"
                    onClick={() => setEditMode(true)}
                >
                    <img
                        src={editImg}
                        alt="Edit"
                    />
                </button>
            </>
        );
    }


    return (
        <div className={style.recipeCard}>
            <div className={style.backButtonFrame}>
                <Link className={style.backButtonLink} to={`/category/${catId}`}>
                    <div className={style.backButton}>
                        <img src={backIcon} alt="up-arrow"/> <span>Rezeptliste</span>
                    </div>
                </Link>
                <div className={[style.actionsRight, style.toolButtons].join(' ')}>
                    {toolbox}
                </div>
            </div>
            {editMode ? (
                <RecipeCardEdit recipe={editableRecipe} setRecipe={setEditableRecipe}/>
            ) : (
                <RecipeCardRead recipe={recipe}/>
            )}

        </div>
    );
}

