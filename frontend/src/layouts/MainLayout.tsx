import '../App.css';
import {Outlet, useLocation, useParams} from "react-router-dom";
import {Breadcrumbs} from "../components/navigation/Breadcrumbs.tsx";
import {CategoryBrowser} from "../components/navigation/CategoryBrowser.tsx";
import {Category} from "../types/category/category.ts";
import {useEffect, useState} from "react";
import {RecipeHeader} from "../types/recipe/recipeHeader.ts";
import {fetchCategories, fetchRecipeList} from "@api";
import {isValidId, transformIdIfValid} from "../utilities/validate.ts";
import {MessageProvider} from '../context/MessageProvider.tsx';
import {DefaultHeader} from "./elements/DefaultHeader.tsx";
import {DefaultFooter} from "./elements/DefaultFooter.tsx";


export default function MainLayout() {

    const [recipes, setRecipeList] = useState<RecipeHeader[]>([]);
    const {categoryId} = useParams();
    const sanitizedCategoryId = !isValidId(categoryId) ? 0 : Number(transformIdIfValid(categoryId));

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories()
            .then((data) => {
                const categories = data.map((cat) =>
                    cat.id === 0 ? {...cat, name: "Shadowcook"} : cat
                );
                setCategories(categories);
            })
            .catch((err) => console.error("Unable to load categories", err));
    }, []);

    const location = useLocation();
    const forceReload = location.state?.forceReload;

    useEffect(() => {
        if (forceReload) {
            fetchRecipeList(sanitizedCategoryId)
                .then((data) => {
                    if (sanitizedCategoryId != null) {
                        console.log(`Fetching ${data.length} recipes for category ${sanitizedCategoryId}`);
                        setRecipeList(data);
                    } else {
                        console.log(`No category selected. No data fetched`);
                    }
                })
                .catch((err) => {
                    console.error("Unable to load recipe list: ", err);
                });
        }
    }, [forceReload, sanitizedCategoryId]);

    useEffect(() => {
        if (sanitizedCategoryId) {
            fetchRecipeList(sanitizedCategoryId)
                .then((data) => {
                    if (sanitizedCategoryId != null) {
                        console.log(`Fetching ${data.length} recipes for category ${sanitizedCategoryId}`);
                        setRecipeList(data);
                    } else {
                        console.log(`No category selected. No data fetched`);
                    }
                })
                .catch((err) => {
                    console.error("Unable to load recipe list: ", err);
                });
        }
    }, [sanitizedCategoryId]);


    return (
        <MessageProvider>
            <div id="rootContent">
                <DefaultHeader showCreateRecipe={true} showUserMenu={true}/>
                <div id="breadcrumbFrame" className="bg-gray-100 p-2">
                    <Breadcrumbs
                        categories={categories}
                        categoryId={sanitizedCategoryId}
                        isStateLess={true}
                    />
                </div>
                <div className="main">
                    <div id="categoryFrame">
                        <div className="categoryFrame">
                            <CategoryBrowser categories={categories} stateLess={true}
                                             onCategorySelect={() => {
                                             }}/>
                        </div>
                    </div>
                    <div id="recipeFrame">
                        <Outlet context={{recipes, categoryId: sanitizedCategoryId}}/>
                    </div>
                </div>
                <div id="footerFrame">
                    <DefaultFooter/>
                </div>
            </div>
        </MessageProvider>
    )
}
