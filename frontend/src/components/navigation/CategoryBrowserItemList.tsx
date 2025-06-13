import {Link} from "react-router-dom";
import style from "./CategoryBrowser.module.css";
import {Category} from "@project-types/category/category.ts";

type CategoryBrowserItemListProps = {
    children: Category[] | undefined;
    isStateLess: boolean;
    onCategoryClick?: (cat: Category) => void;
};

export function CategoryBrowserItemList({
                                            children,
                                            isStateLess,
                                            onCategoryClick,
                                        }: CategoryBrowserItemListProps) {
    return (
        children?.map((cat) => (
            isStateLess ? (
                    <Link key={`category-${cat.id}`} className={style.categoryLink} to={`/category/${cat.id}`}>
                        <div className={style.categoryItemFrame}>
                            {cat.name}
                        </div>
                    </Link>
                ) :
                (
                    <div
                        key={`category-${cat.id}`} className={style.categoryLinkFrame}
                        onClick={() => onCategoryClick?.(cat)}
                    >
                        <div>
                            {cat.name}
                        </div>
                    </div>
                )
        ))
    )
}