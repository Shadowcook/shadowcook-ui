import {Category} from "@project-types/category/category.ts";
import style from "./Breadcrumbs.module.css";
import {BreadcrumbButton} from "./BreadcrumbButton.tsx";

type BreadcrumbsProps = {
    categories: Category[];
    categoryId: number;
    isStateLess: boolean;
    onCategoryClick?: (cat: Category) => void;
};

export function Breadcrumbs({
                                categories,
                                categoryId,
                                isStateLess,
                                onCategoryClick,
                            }: BreadcrumbsProps) {
    const path: Category[] = [];

    let current: Category | undefined = categories.find((cat) => cat.id === categoryId);

    while (current != null) {
        path.unshift(current);
        const parentId = current.parent;
        current = categories.find((cat) => cat.id === parentId);
    }

    return (
        <div className={style.breadcrumbContainer}>
            <BreadcrumbButton
                path={path}
                isStateLess={isStateLess}
                onCategoryClick={(cat) => onCategoryClick?.(cat)}
            />
        </div>
    );
}
