import {Route, Routes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LogoutLayout from "./layouts/LogoutLayout";
import {RecipeListView} from "./components/RecipeListView";
import {RecipeView} from "./components/RecipeView";
import {SessionProvider} from "./session/SessionContext.tsx";
import './Global.css';
import {LogoutSuccessPage} from "./components/LogoutSuccessPage.tsx";


export default function App() {
    return (
        <SessionProvider>
            <Routes>
                <Route path="/logout-success" element={<LogoutLayout/>}>
                    <Route index element={<LogoutSuccessPage/>}/>
                </Route>
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<RecipeListView/>}/>
                    <Route path="category/:categoryId" element={<RecipeListView/>}/>
                    <Route path="recipe/:recipeId" element={<RecipeView/>}/>
                    <Route path="category/:categoryId/recipe/:recipeId" element={<RecipeView/>}/>
                </Route>
            </Routes>
        </SessionProvider>
    );
}