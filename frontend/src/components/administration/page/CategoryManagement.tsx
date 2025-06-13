import {useSession} from "../../../session/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import {Category} from "../CategorySelectorModal.tsx";
import {useEffect, useState} from "react";
import {fetchCategories} from "@api";
import {CategoryBrowser} from "../../navigation/CategoryBrowser.tsx";
import style from "./CategoryManagement.module.css"


export function CategoryManagement() {
    const session = useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showCategorySelection, setShowCategorySelection] = useState(false);

    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_CATEGORY)) {
            console.error("ACCESS DENIED!")
            return;
        }
        fetchCategories().then((data) => setCategories(data));
    }, [session])

    if (!validateAccess(session, AccessId.EDIT_CATEGORY)) {
        console.error("ACCESS DENIED!")
        return (<>ACCESS DENIED</>);
    }


    function handleCategorySelection(category: Category) {
        if (category) {
            setSelectedCategory(category)
        } else {
            setSelectedCategory(null);
        }
    }

    return (
        <div className={style.categoryLayout}>
            <div className={style.categoryContainer}>
                <CategoryBrowser
                    categories={categories}
                    stateLess={false}
                    onCategorySelect={(category: Category) => {
                        handleCategorySelection(category);
                    }}
                />
            </div>
            <div className={style.categoryOptions}>
                <h2>{selectedCategory ? selectedCategory.name : "New Category"}</h2>
            </div>
        </div>
    );
}