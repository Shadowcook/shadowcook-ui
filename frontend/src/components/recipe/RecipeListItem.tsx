import style from "./RecipeListItem.module.css"
import {Link} from 'react-router-dom';
import no_thumbnail from "@assets/no_thumbnail.png";

type RecipeCardProps = {
    id: number;
    name: string;
    description?: string;
    thumbnail?: string;
    categoryId: number;
};


export function RecipeListItem(recipe: RecipeCardProps) {
    return (
        <Link className={style.cardLink}
            to={`/category/${recipe.categoryId}/recipe/${recipe.id}`}>
            <div className={style.cardFrame}>
                <div className="thumbnailFrame"><img src={no_thumbnail} alt={recipe.name}/> </div>
                <div className="recipeDataFrame">
                    <h3>{recipe.name}</h3>
                    <span>{recipe.description}</span>
                </div>
            </div>
        </Link>
    );
}