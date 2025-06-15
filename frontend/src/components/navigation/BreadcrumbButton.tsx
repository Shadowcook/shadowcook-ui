import {Category} from "@project-types/category/category.ts";
import React from "react";
import {Link} from "react-router-dom";
import style from "./Breadcrumbs.module.css";
import breadCrumbChevron from "@assets/font-awesome/solid/chevron-right.svg";


type BreadcrumbButtonProps = {
    path: Category[];
    isStateLess: boolean;
    onCategoryClick?: (cat: Category) => void;
};

export function BreadcrumbButton({
                                     path,
                                     isStateLess,
                                     onCategoryClick,
                                 }: BreadcrumbButtonProps) {

    return (
        path.map((cat, index) => (
            isStateLess ? (
                <React.Fragment key={cat.id}>
                    <Link to={`/category/${cat.id}`} className={style.breadcrumbLink}>
                        <div className={style.breadcrumbFrame}>{cat.name}</div>
                    </Link>
                    {index < path.length - 1 &&
                        <img className={style.breadcrumbChevron} src={breadCrumbChevron} alt="&gt;&gt;"/>}
                </React.Fragment>
            ) : (
                <React.Fragment key={cat.id}>
                    <div onClick={() => onCategoryClick?.(cat)} className={style.breadcrumbLinkFrame}>
                        {cat.name}
                    </div>
                    {index < path.length - 1 &&
                        <img className={style.breadcrumbChevron} src={breadCrumbChevron} alt="&gt;&gt;"/>}
                </React.Fragment>
            )
        ))
    );
}