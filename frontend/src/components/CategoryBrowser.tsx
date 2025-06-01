import {Category} from "../types/category";
import {Link, useParams} from 'react-router-dom';
import {validateId} from "../utilities/validate.ts";
import style from "./CategoryBrowser.module.css";
import backIcon from "../assets//font-awesome/solid/backward.svg"

type CategoryBrowserProps = {
    categories: Category[];
};

export function CategoryBrowser({
                                    categories,
                                }: CategoryBrowserProps) {
    const {categoryId} = useParams();
    const id = validateId(categoryId);
    const children = categories.filter((cat) => cat.parent === id);
    const currentCategory = categories.find((cat) => cat.id === id);
    const parentCategory = categories.find((cat) => cat.id === currentCategory?.parent);
    return (
        <div className="flex flex-col space-y-2">
            {currentCategory && currentCategory.parent > -1 && parentCategory && (
                <Link className={style.categoryLink} to={`/category/${parentCategory.id}`}>
                    <div className={style.categoryBackFrame}>
                        <img src={backIcon} alt="navigate back" /> <span>{parentCategory.name}</span>
                    </div>
                </Link>
            )}
            {children.map((cat) => (
                <Link key={`category-${cat.id}`} className={style.categoryLink} to={`/category/${cat.id}`}>
                    <div key={cat.id} className={style.categoryItemFrame}>
                        {cat.name}
                    </div>
                </Link>
            ))}
        </div>
    );
}