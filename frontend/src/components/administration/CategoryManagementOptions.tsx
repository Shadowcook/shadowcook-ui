// import {CategorySelectModal} from "./CategorySelectModal.tsx";
import style from "./CategoryManagementOptions.module.css";
import addCategoryIcon from "@assets/font-awesome/solid/folder-plus.svg";
import deleteCategoryIcon from "@assets/font-awesome/solid/folder-minus.svg";
// import moveCategoryIcon from "@assets/font-awesome/solid/arrows-up-down-left-right.svg";
import editCategoryIcon from "@assets/font-awesome/solid/pen.svg";
import saveCategoryIcon from "@assets/font-awesome/solid/floppy-disk.svg";
import {Category} from "@project-types/category/category.ts";
import {useEffect, useState} from "react";

export function CategoryManagementOptions(props: {
    selectedCategory: Category,
    categories: Category[],
    onClickNew: (category: Category) => void,
    onClickDelete: (categoryToDelete: Category) => void,
    // onClickMove: (cat: Category) => void,
    onClickRename: (cat: Category) => void
}) {
    const [selectedCategory, setSelectedCategory] = useState<Category>(props.selectedCategory);
    // const [modalHeadline, setModalHeadline] = useState<string>("");
    // const [showCategorySelection, setShowCategorySelection] = useState(false);
    const [isEditMode, setEditMode] = useState(false);

    useEffect(() => {
        setSelectedCategory(props.selectedCategory);
    }, [props.selectedCategory]);

    return (
        <div className={style.categoryMaintenanceFrame}>
            {/*{showCategorySelection && (*/}
            {/*    <CategorySelectModal*/}
            {/*        categories={props.categories}*/}
            {/*        headline={modalHeadline}*/}
            {/*        actionCategory={selectedCategory}*/}
            {/*        onConfirm={(cat) => {*/}
            {/*            props.onClickDelete(cat);*/}
            {/*            setShowCategorySelection(false);*/}
            {/*        }}*/}
            {/*        onCancel={() => setShowCategorySelection(false)}*/}
            {/*    />*/}
            {/*)}*/}
            <div className={style.categoryHead}>

                {isEditMode ? (
                    <>
                        <input
                            type="text"
                            value={selectedCategory.name}
                            onChange={(e) => {
                                const updatedCategory = {
                                    ...selectedCategory,
                                    name: e.target.value
                                };
                                setSelectedCategory(updatedCategory);
                            }}
                        />
                        <button
                            className="imageButton"
                            onClick={() => {
                                props.onClickRename(selectedCategory);
                                setEditMode(false)
                            }}
                        >
                            <img src={saveCategoryIcon} alt="save"/>
                        </button>
                    </>
                ) : (
                    <>
                        <h2>{selectedCategory.name}</h2>
                        <button
                            className={selectedCategory.id > 0 ? "imageButton" : "imageButtonDisabled"}
                            disabled={selectedCategory.id < 1}
                            onClick={() => {
                                setEditMode(true)
                            }}
                        >
                            <img src={editCategoryIcon} alt="edit"/>
                        </button>
                    </>
                )}
            </div>
            <div className={style.categoryMaintenance}>
                <div className={style.newCategory}>
                    <input
                        type="text"
                        onChange={(e) => {
                            if (!selectedCategory) return;

                            const updatedCategory = {
                                ...selectedCategory,
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
                    {selectedCategory.id > 0 ? (
                        <>
                            <button
                                className="imageButton"
                                onClick={() => {
                                    props.onClickDelete(selectedCategory);
                                }}>
                                <img src={deleteCategoryIcon} alt="delete category"/> Delete
                                Category
                            </button>
                            {/*<button*/}
                            {/*    className="imageButton"*/}
                            {/*    onClick={() => props.onClickMove(selectedCategory)}>*/}
                            {/*    <img src={moveCategoryIcon} alt="move category"/> Move Category*/}
                            {/*</button>*/}
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}