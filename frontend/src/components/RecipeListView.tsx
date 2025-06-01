import {RecipeHeader} from "../types/recipe/recipeHeader.ts";
import {RecipeListItem} from "./RecipeListItem.tsx";
import {useOutletContext} from "react-router-dom";
import './Modules.css';
import shadowCookLogo from "../assets/shadowcook._alpha.png"

type ContextType = {
    recipes: RecipeHeader[];
    categoryId: number;
};

export function RecipeListView() {
    const {recipes, categoryId} = useOutletContext<ContextType>();
    if (recipes.length === 0) {
        return (
            <div className="loadingLogoFrame">
                <img src={shadowCookLogo} alt="No recipes in here so far." />
            </div>
        );
    } else {
        recipes.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
    }

    return (
        <div className="flex flex-col space-y-2">
            {recipes.map((recipe) => (
                <RecipeListItem key={recipe.id}
                                id={recipe.id}
                                name={recipe.name}
                                description={recipe.description}
                                thumbnail={recipe.thumbnail}
                                categoryId={categoryId}
                />
            ))}
        </div>
    );
}