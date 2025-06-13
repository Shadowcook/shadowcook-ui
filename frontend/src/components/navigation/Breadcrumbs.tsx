import {Category} from "@project-types/category/category.ts";
import React from "react";
import {Link} from "react-router-dom";
import style from "./Breadcrumbs.module.css";
import breadCrumbChevron from "@assets/font-awesome/solid/chevron-right.svg"

type BreadcrumbsProps = {
    categories: Category[];
    categoryId: number;
};

export function Breadcrumbs({
                                categories,
                                categoryId,
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
            {path.map((cat, index) => (
                <React.Fragment key={cat.id}>
                    <Link to={`/category/${cat.id}`} className={style.breadcrumbLink}>
                        <div className={style.breadcrumbFrame}>{cat.name}</div>
                    </Link>
                    {index < path.length - 1 && <img className={style.breadcrumbChevron} src={breadCrumbChevron} alt="&gt;&gt;"/>}
                </React.Fragment>
            ))}
        </div>
    );
}
