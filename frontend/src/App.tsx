import {Route, Routes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LogoutLayout from "./layouts/LogoutLayout";
import {RecipeListView} from "./components/recipe/RecipeListView.tsx";
import {RecipeView} from "./components/recipe/RecipeView.tsx";
import {SessionProvider} from "./contexts/SessionContext.tsx";
import './Global.css';
import {LogoutSuccessPage} from "./components/user/LogoutSuccessPage.tsx";
import ManagementLayout from "./layouts/ManagementLayout.tsx";
import {ManagementHome} from "./components/administration/page/ManagementHome.tsx";
import {UserManagement} from "./components/administration/page/UserManagement.tsx";
import {RoleManagement} from "./components/administration/page/RoleManagement.tsx";
import {UomManagement} from "./components/administration/page/UomManagement.tsx";
import {CategoryManagement} from "./components/administration/page/CategoryManagement.tsx";
import {SetPasswordPage} from "./components/user/SetPasswordPage.tsx";
import {InvalidPage} from "./components/error/InvalidPage.tsx";
import {DataProtection} from "./components/legal/DataProtection.tsx";


export default function App() {
    return (
        <SessionProvider>
            <Routes>
                <Route path="/legal" element={<LogoutLayout/>}>
                    <Route index element={<InvalidPage/>}/>
                    <Route path="dataprotection" element={<DataProtection/>}/>
                </Route>
                <Route path="/password" element={<LogoutLayout/>}>
                    <Route index element={<InvalidPage/>}/>
                    <Route path=":username/:token" element={<SetPasswordPage/>}/>
                </Route>
                <Route path="/logout-success" element={<LogoutLayout/>}>
                    <Route index element={<LogoutSuccessPage/>}/>
                </Route>
                <Route path="/management" element={<ManagementLayout/>}>
                    <Route index element={<ManagementHome/>}/>
                    <Route path="roles" element={<RoleManagement/>}/>
                    <Route path="users" element={<UserManagement/>}/>
                    <Route path="uoms" element={<UomManagement/>}/>
                    <Route path="categories" element={<CategoryManagement/>}/>
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