import {Routes, Route} from "react-router-dom";
import  MainLayout  from "./layouts/MainLayout";
import { RecipeListView } from "./components/RecipeListView";
import { RecipeView } from "./components/RecipeView";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<RecipeListView />} />
                <Route path="category/:categoryId" element={<RecipeListView />} />
                <Route path="category/:categoryId/recipe/:recipeId" element={<RecipeView />} />
            </Route>
        </Routes>
    );
}