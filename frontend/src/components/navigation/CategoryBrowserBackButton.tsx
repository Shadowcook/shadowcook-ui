import {Category} from "@project-types/category/category.ts";
import {Link} from "react-router-dom";
import style from "./CategoryBrowser.module.css";
import backIcon from "@assets/font-awesome/solid/backward.svg";

export function CategoryBrowserBackButton(props: {
    currentCategory: Category | undefined,
    parentCategory: Category | undefined,
    stateLess: boolean,
    onClick: () => void
}) {
    return <>
        {props.currentCategory && props.currentCategory.parent > -1 && props.parentCategory && (

            props.stateLess ? (
                <Link className={style.categoryLink} to={`/category/${props.parentCategory.id}`}>
                    <div className={style.categoryBackFrame}>
                        <img src={backIcon} alt="navigate back"/> <span>{props.parentCategory.name}</span>
                    </div>
                </Link>
            ) : (
                <div
                    className={style.categoryBackFrame}
                    onClick={props.onClick}
                >
                    <div>
                        <img src={backIcon} alt="navigate back"/> <span>{props.parentCategory.name}</span>
                    </div>
                </div>
            )
        )}
    </>;
}