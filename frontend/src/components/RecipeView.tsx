import {Link, useNavigate, useParams} from "react-router-dom";
import {validateAccess, validateId} from "../utilities/validate.ts";
import {
    deleteRecipe,
    fetchRecipe,
    fetchRecipeCategories,
    fetchUomList,
    pushRecipe,
    pushRecipeCategories
} from "../api/api.ts";
import {Recipe} from "../types/recipe.ts";
import style from "./RecipeView.module.css"
import './Modules.css';
import shadowCookLogo from "../assets/shadowcook._alpha.png";
import backIcon from "../assets/font-awesome/solid/turn-up.svg";
import {RecipeCardRead} from "./RecipeCardRead.tsx";
import {useEffect, useState} from "react";
import editImg from "../assets/font-awesome/solid/pen.svg"
import deleteImg from "../assets/font-awesome/solid/trash-can.svg"
import saveImg from "../assets/font-awesome/solid/floppy-disk.svg"
import closeImg from "../assets/font-awesome/solid/circle-xmark.svg"
import {RecipeCardEdit} from "./RecipeCardEdit.tsx";
import {Uom} from "../types/uom.ts";
import {useMessage} from "../hooks/useMessage.ts";
import categoryEditorIcon from "../assets/font-awesome/solid/folder-tree.svg"
import ModalCategorySelector from "./ModalCategorySelector.tsx";
import {createEmptyRecipe} from "../types/createEmptyRecipe.ts";
import {useSession} from "../session/SessionContext.tsx";
import {AccessId} from "../types/accessId.ts";
import DeleteRecipeModal from "./DeleteRecipeModal.tsx";

export function RecipeView() {

    const {recipeId, categoryId} = useParams();
    const catId = validateId(categoryId);
    const isNewRecipe = recipeId === 'new';
    const sanitizedRecipeId = isNewRecipe ? undefined : validateId(recipeId);
    const [recipe, setRecipe] = useState<Recipe | null>();
    const [editMode, setEditMode] = useState(false);
    const [editableRecipe, setEditableRecipe] = useState<Recipe | null>(null);
    const [uomList, setUomList] = useState<Uom[]>([]);
    const {showMessage} = useMessage();
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pendingCategories, setPendingCategories] = useState<number[] | undefined>(undefined);
    const navigate = useNavigate();
    const session = useSession();


    useEffect(() => {
        if (editMode && pendingCategories === undefined && recipe !== null && recipe !== undefined) {
            fetchRecipeCategories(recipe.recipe.id)
                .then((recipeCategories) => {
                    const categoryIds = recipeCategories.map(rc => rc.category);
                    setPendingCategories(categoryIds);
                })
                .catch(err => console.error("Category fetch failed:", err));
        }
    });

    const openConfirmDeleteRecipe = () => {
        setDeleteModalOpen(true);
    }

    const openModalCategorySelection = () => {
        setModalOpen(true);
    };

    const handleSaveCategories = (newSelected: number[]) => {
        setPendingCategories(newSelected);
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
        }
    }, [recipeId]);

    useEffect(() => {
        if (sanitizedRecipeId !== undefined && recipeId !== "new") {
            fetchRecipe(sanitizedRecipeId)
                .then(setRecipe)
                .catch((err) =>
                    console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err)
                );
        }
    }, [sanitizedRecipeId, recipeId]);

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
        if (sanitizedRecipeId === undefined) {
            console.warn("No recipe ID available – cannot reload recipe.");
            return;
        }

        fetchRecipe(sanitizedRecipeId)
            .then(setRecipe)
            .catch((err) => console.error(`Unable to load recipe with id ${sanitizedRecipeId}`, err));
    }

    async function saveRecipe() {
        if (!editableRecipe) return;

        const savedRecipe = await pushRecipe(editableRecipe);
        if (!savedRecipe || !savedRecipe.recipe.id) {
            showMessage("Failed to save recipe.", "error");
            return;
        }

        const recipeId = savedRecipe.recipe.id;


        if (pendingCategories !== undefined && pendingCategories.length > 0) {
            const success = await pushRecipeCategories(recipeId, pendingCategories);
            if (!success) {
                showMessage("Recipe saved, but failed to update categories.", "warning");
                return;
            }
        }

        setRecipe(savedRecipe);
        setEditableRecipe(structuredClone(savedRecipe));
        showMessage("Recipe saved successfully.", "success");
    }

    if (editMode && validateAccess(session, AccessId.EDIT_RECIPE)) {

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
            </>
        );


        toolbox = (
            <>
                <button
                    className="shadowButton"
                    onClick={async () => {
                        if (isNewRecipe) {
                            navigate(`/`);
                        } else {
                            setEditMode(false);
                            reloadRecipe();
                        }
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
                <button
                    className="shadowButton"
                    onClick={() => openConfirmDeleteRecipe()}
                >
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
        if (validateAccess(session, AccessId.EDIT_RECIPE)) {
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
        } else {
            toolbox = (
                <></>
            )
        }
    }

    return (
        <>
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

            {deleteModalOpen && (
                <DeleteRecipeModal
                    isOpen={deleteModalOpen}
                    recipe={recipe}
                    onCancel={() => setDeleteModalOpen(false)}
                    onConfirm={async () => {
                        const trueRecipeNumberId = Number(sanitizedRecipeId);
                        if (!isNaN(trueRecipeNumberId)) {
                            if (await deleteRecipe(trueRecipeNumberId)) {
                                setDeleteModalOpen(false);
                                showMessage(`Recipe "${recipe?.recipe.name}" has been deleted.`, "success");
                                navigate(`/category/${categoryId}`, { state: { forceReload: true } });
                            } else {
                                showMessage("Failed to delete recipe.", "warning");
                            }
                        } else {
                            showMessage(`"${sanitizedRecipeId}" is not a valid recipe ID`, "warning");
                        }
                    }}
                />
            )}

            {modalOpen && (
                <ModalCategorySelector
                    recipeId={recipe.recipe.id}
                    selectedCategories={pendingCategories ?? []}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveCategories}
                />
            )}
        </>
    );
}

