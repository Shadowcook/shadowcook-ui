import {CategorySelectModal} from "./CategorySelectModal.tsx";
import style from "./CategoryManagementOptions.module.css";
import addCategoryIcon from "@assets/font-awesome/solid/folder-plus.svg";
import deleteCategoryIcon from "@assets/font-awesome/solid/folder-minus.svg";
import moveCategoryIcon from "@assets/font-awesome/solid/arrows-up-down-left-right.svg";
import {Category} from "@project-types/category/category.ts";
import {useState} from "react";

export function CategoryManagementOptions(props: {
    selectedCategory: Category,
    categories: Category[],
    onClickNew: (category: Category) => void,
    onClickDelete: (categoryToDelete: Category) => void,
    onClickMove: (cat: Category) => void
}) {
    const [selectedCategory, setSelectedCategory] = useState<Category>(props.selectedCategory);
    const [modalHeadline, setModalHeadline] = useState<string>("");
    const [showCategorySelection, setShowCategorySelection] = useState(false);

    return (
        <div className={style.categoryMaintenanceFrame}>
            {showCategorySelection && (
                <CategorySelectModal
                    categories={props.categories}
                    headline={modalHeadline}
                    actionCategory={selectedCategory}
                    onConfirm={(cat) => {
                        props.onClickDelete(props.selectedCategory, cat);
                        setShowCategorySelection(false);
                    }}
                    onCancel={() => setShowCategorySelection(false)}
                />
            )}
            <h2>{props.selectedCategory.name}</h2>
            <div className={style.categoryMaintenance}>
                <div className={style.newCategory}>
                    <input
                        type="text"
                        onChange={(e) => {
                            if (!props.selectedCategory) return;

                            const updatedCategory = {
                                ...props.selectedCategory,
                                name: e.target.value
                            };
                            setSelectedCategory(updatedCategory);
                            console.log("Updated category: ", updatedCategory);
                        }}
                    />
                    <button className="imageButton"
                            onClick={() => {
                                if (selectedCategory) {
                                    props.onClickNew(selectedCategory);
                                }
                            }}
                    >
                        <img src={addCategoryIcon} alt="add category"/> Add category
                    </button>
                </div>
                <div className={style.categoryOperations}>
                    {props.selectedCategory.id > 0 ? (
                        <>
                            <button
                                className="imageButton"
                                onClick={() => {props.onClickDelete(selectedCategory);
                                }}>
                                <img src={deleteCategoryIcon} alt="delete category"/> Delete
                                Category
                            </button>
                            <button
                                className="imageButton"
                                onClick={() => props.onClickMove(selectedCategory)}>
                                <img src={moveCategoryIcon} alt="move category"/> Move Category
                            </button>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}