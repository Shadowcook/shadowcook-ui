import {Category} from "@project-types/category/category.ts";
import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {isValidId, transformIdIfValid} from "../../utilities/validate.ts";
import {CategoryBrowserBackButton} from "./CategoryBrowserBackButton.tsx";
import {CategoryBrowserItemList} from "./CategoryBrowserItemList.tsx";

type CategoryBrowserProps = {
    categories: Category[];
    stateLess: boolean;
    onCategorySelect: (category: Category) => void;
};

export function CategoryBrowser({
                                    categories,
                                    stateLess,
                                    onCategorySelect,
                                }: CategoryBrowserProps) {
    const {categoryId} = useParams();
    const isStateLess = stateLess;

    const [children, setChildren] = useState<Category[]>();
    const [currentCategory, setCurrentCategory] = useState<Category>();
    const [parentCategory, setParentCategory] = useState<Category>();

    useEffect(() => {
        let id = 0;
        if (isStateLess) {
            id = !isValidId(categoryId) ? 0 : Number(transformIdIfValid(categoryId));
        } else {
            id = currentCategory ? currentCategory.id : 0;
        }
        const current = categories.find(cat => cat.id === id);
        setCurrentCategory(current);
        setParentCategory(categories.find(cat => cat.id === current?.parent));
        setChildren(categories.filter((cat) => cat.parent === id))
    }, [currentCategory, categories, isStateLess, categoryId]);

    return (
        <div className="flex flex-col space-y-2">
            <CategoryBrowserBackButton
                currentCategory={currentCategory}
                parentCategory={parentCategory}
                stateLess={isStateLess}
                onClick={() => {
                    setCurrentCategory(parentCategory)
                    if (parentCategory) {
                        onCategorySelect(parentCategory);
                    }
                }}
            />
            <CategoryBrowserItemList
                children={children}
                isStateLess={isStateLess}
                onCategoryClick={(cat) => {
                    setCurrentCategory(cat);
                    onCategorySelect(cat);
                }}
            />
        </div>
    );
}