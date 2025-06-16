import {useSession} from "../../../session/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import {useEffect, useState} from "react";
import {deleteCategory, fetchCategories, pushCategory} from "@api";
import {CategoryBrowser} from "../../navigation/CategoryBrowser.tsx";
import style from "./CategoryManagement.module.css"
import {Breadcrumbs} from "../../navigation/Breadcrumbs.tsx";
import {CategoryManagementOptions} from "../CategoryManagementOptions.tsx";
import {useMessage} from "../../../hooks/useMessage.ts";
import {sortByField} from "../../../utilities/tools.ts";
import {Category} from "@project-types/category/category.ts";
import {ConfirmDialog} from "../../tools/ConfirmDialog.tsx";


export function CategoryManagement() {
    const session = useSession();
    const {showMessage} = useMessage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);


    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_CATEGORY)) {
            console.error("ACCESS DENIED!")
            return;
        }
        fetchCategories().then((data) => setSortedCategories(data));
    }, [session])

    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            const root = categories.find(cat => cat.id === 0);
            if (root) {
                setSelectedCategory(root);
            }
        }
    }, [categories, selectedCategory]);

    if (!validateAccess(session, AccessId.EDIT_CATEGORY)) {
        console.error("ACCESS DENIED!")
        return (<>ACCESS DENIED</>);
    }

    function setSortedCategories(categories: Category[]) {
        setCategories(sortByField<Category>(categories, "name"));
    }

    function handleCategorySelection(category: Category) {
        if (category) {
            setSelectedCategory(category)
        } else {
            setSelectedCategory(null);
        }
    }

    const selectedId: number = selectedCategory ? selectedCategory.id : 0;

    async function handleAddCategory(cat: Category) {
        console.log("Received category: ", cat);
        if (selectedCategory) {
            const newCategory: Category = {
                id: -1,
                name: cat.name,
                parent: selectedCategory.id
            }
            try {
                console.log("New category object: ", newCategory);
                const response = await pushCategory(newCategory);
                if (response.success) {
                    const updatedCategories: Category[] = [
                        ...categories,
                        response.categories[0]
                    ]
                    setSortedCategories(updatedCategories);
                    showMessage("Category saved", "success");
                } else {
                    console.error("Unable to save new category", response);
                    showMessage("Error creating new category. Please check log.", "error");
                }
            } catch (error) {
                console.error("Caught error while creating new category: ", error);
                showMessage("API error creating new category. Please check log.", "error");
            }
        } else {
            showMessage("No category is selected. Please select category to add the new one to.", "error")
        }
    }

    function confirmDeleteCategory() {
        setShowDeleteDialog(true);
    }

    async function handleDeleteCategory(catDelete: Category | null) {
        console.log({function: "confirmDeleteCategory", catDelete: catDelete});
        if (catDelete) {
            try {
                const delRes = await deleteCategory(catDelete);
                if (delRes.success) {
                    fetchCategories().then((data) => setSortedCategories(data));
                    showMessage(` ${delRes.categories.length} ${delRes.categories.length === 1 ? " category" : " categories"} deleted`, "success");
                } else {
                    console.error("Unable to save category. Please check log.", delRes);
                    showMessage("Unable to delete category. Please check log.", "error");
                }
            } catch (e) {
                console.error("Unable to delete category: ", e);
                showMessage("Unable to delete category. Please check log.", "error");
            }

        } else {
            showMessage("Category selection aborted", "info");
        }
    }

    async function handleUpdateCategory(cat: Category) {
        console.log("Updating category: ", cat);
        try {
            const res = await pushCategory(cat);
            if (res.success) {
                const updatedCategories = categories.map((category) =>
                    category.id === cat.id ? {...category, name: cat.name} : category
                );
                setCategories(updatedCategories);
                showMessage("Category updated");
            } else {
                console.error("Unable to update category", res);
                showMessage("Failed to update category. Please check log file", "error");
            }
        } catch (err) {
            console.error("Server error while updating category", err);
            showMessage("Failed to update category. Please check log file", "error");
        }
    }


    function confirmMoveCategory(cat) {

    }

    return (
        <>
            {selectedCategory && (
                <ConfirmDialog
                    open={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={() => handleDeleteCategory(selectedCategory)}
                    title={`Delete category ${selectedCategory.name}`}
                    message="Are you sure you want to delete this category? This can not be undone!"
                    requireConfirmationInput={false}
                    confirmationText="DELETE"
                />
            )}

            <div>
                <Breadcrumbs
                    categories={categories}
                    categoryId={selectedId}
                    isStateLess={false}
                    onCategoryClick={(cat) => {
                        handleCategorySelection(cat);
                    }}
                />
            </div>
            <div className={style.categoryLayout}>
                <div className={style.categoryContainer}>
                    <CategoryBrowser
                        categories={categories}
                        stateLess={false}
                        selectedCategory={selectedCategory}
                        onCategorySelect={(category: Category) => {
                            handleCategorySelection(category);
                        }}
                    />
                </div>
                <div className={style.categoryOptions}>
                    {selectedCategory ? (
                        <>
                            <CategoryManagementOptions selectedCategory={selectedCategory}
                                                       categories={categories}
                                                       onClickNew={(cat) => handleAddCategory(cat)}
                                                       onClickDelete={() => confirmDeleteCategory()}
                                                       onClickMove={(cat) => confirmMoveCategory(cat)}
                                                       onClickRename={(cat: Category) => handleUpdateCategory(cat)
                                                       }/>
                        </>
                    ) : (
                        <>
                            <h2>No category has been selected. Please choose one on the left.</h2>
                        </>
                    )
                    }
                </div>
            </div>
        </>
    );
}