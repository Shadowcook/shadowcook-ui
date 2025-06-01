import {Link, useParams} from "react-router-dom";
import {validateId} from "../utilities/validate.ts";
import {fetchRecipe, fetchUomList, pushRecipe, pushRecipeCategories} from "../api/api.ts";
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
import closeImg from "../assets/circle-xmark.svg"
import {RecipeCardEdit} from "./RecipeCardEdit.tsx";
import {Uom} from "../types/uom.ts";
import {useMessage} from "../hooks/useMessage.ts";
import categoryEditorIcon from "../assets/folder-tree.svg"
import ModalCategorySelector from "./ModalCategorySelector.tsx";
import {createEmptyRecipe} from "../types/createEmptyRecipe.ts";

export function RecipeView() {

    const {recipeId, categoryId} = useParams();
    const catId = validateId(categoryId);
    const sanitizedRecipeId = validateId(recipeId);
    const [recipe, setRecipe] = useState<Recipe | null>();
    const [editMode, setEditMode] = useState(false);
    const [editableRecipe, setEditableRecipe] = useState<Recipe | null>(null);
    const [uomList, setUomList] = useState<Uom[]>([]);
    const {showMessage} = useMessage();
    const [modalOpen, setModalOpen] = useState(false);

    const openModalCategorySelection = () => {
        setModalOpen(true);
    };

    const handleSaveCategories = async (newSelected: number[]) => {
        let selectedRecipeId: number | undefined = recipe?.recipe.id;

        if (!selectedRecipeId || selectedRecipeId === 0) {
            if (!editableRecipe) {
                showMessage("No recipe to save.", "error");
                return;
            }

            const savedRecipe = await pushRecipe(editableRecipe);
            if (!savedRecipe || !savedRecipe.recipe.id) {
                showMessage("Failed to save recipe before assigning categories.", "error");
                return;
            }

            selectedRecipeId = savedRecipe.recipe.id;
            setRecipe(savedRecipe);
            setEditableRecipe(structuredClone(savedRecipe));
        }

        if (await pushRecipeCategories(selectedRecipeId, newSelected)) {
            console.log(`Added recipe to ${newSelected.length} categories: ${newSelected}`);
            showMessage(`Added recipe to ${newSelected.length} categories`, "info");
        } else {
            showMessage(`Unable to save new categories`, "error");
        }

        setModalOpen(false);
    };

    useEffect(() => {
        if (editMode) {
            console.log("fetching UOM...");
            fetchUomList()
                .then((result) => {
                    console.log("fetched UOM data:", result);
                    setUomList(result ?? []);
                })
                .catch((err) => {
                    console.error("UOM fetch failed:", err);
                    setUomList([]);
                });
        }
    }, [editMode]);

    useEffect(() => {
        if (recipeId === "new") {
            const newRecipe = createEmptyRecipe();
            setRecipe(newRecipe);
            setEditMode(true);
        } else {
            fetchRecipe(sanitizedRecipeId)
                .then(setRecipe)
                .catch((err) => console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err));
        }
    }, [recipeId, sanitizedRecipeId]);

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
    let navigateBack;

    function reloadRecipe() {
        fetchRecipe(sanitizedRecipeId)
            .then(setRecipe)
            .catch((err) => console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err));
    }

    async function saveRecipe() {
        if (editableRecipe) {
            console.log("Trying to save recipe: ", editableRecipe);
            const saveSuccess = await pushRecipe(editableRecipe);
            if (saveSuccess) {
                showMessage("Recipe saved successfully.", "success");
            } else {
                showMessage("Saving recipe failed. Please check log.", "error", 30000);
            }
        } else {
            showMessage("No recipe loaded. Cannot save.", "warning", 8000);
        }
    }

    if (editMode) {

        navigateBack = (
            <>
                <div className={style.backButtonDisabled}>
                    <img src={backIcon} alt="up-arrow"/> <span>Rezeptliste</span>
                </div>
                <div className={style.backButton}>
                    <button className="shadowButton" onClick={openModalCategorySelection}>
                        <img src={categoryEditorIcon} alt="category editor"/>
                    </button>
                </div>

                {modalOpen && (
                    <ModalCategorySelector
                        recipeId={recipe.recipe.id}
                        onClose={() => setModalOpen(false)}
                        onSave={handleSaveCategories}
                    />
                )}
            </>
        );


        toolbox = (
            <>
                <button
                    className="shadowButton"
                    onClick={async () => {
                        setEditMode(false);
                        reloadRecipe();
                    }}
                >
                    <img
                        src={closeImg}
                        alt="Close"
                    />
                </button>
                <button
                    className="shadowButton"
                    onClick={() => saveRecipe()}
                >
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

        navigateBack = (
            <Link className={style.backButtonLink} to={`/category/${catId}`}>
                <div className={style.backButton}>
                    <img src={backIcon} alt="up-arrow"/> <span>Rezeptliste</span>
                </div>
            </Link>
        )

        toolbox = (
            <>
                <button
                    className="shadowButton"
                    disabled={!recipe}
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
                {navigateBack}
                <div className={[style.actionsRight, style.toolButtons].join(' ')}>
                    {toolbox}
                </div>
            </div>
            {editMode ? (
                <RecipeCardEdit recipe={editableRecipe} uomList={uomList} setRecipe={setEditableRecipe}/>
            ) : (
                <RecipeCardRead recipe={recipe}/>
            )}

        </div>
    );
}

