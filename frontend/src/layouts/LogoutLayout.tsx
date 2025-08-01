import {Outlet} from "react-router-dom";
import '../App.css';
import {DefaultHeader} from "./elements/DefaultHeader.tsx";
import {DefaultFooter} from "./elements/DefaultFooter.tsx";


export default function Logout() {
    return (
        <div id="rootContent">
            <DefaultHeader showCreateRecipe={false} showUserMenu={false}/>
            <div id="breadcrumbFrame" className="bg-gray-100 p-2">

            </div>
            <div className="main">
                <div id="recipeFrame">
                    <Outlet/>
                </div>
            </div>
            <div id="footerFrame">
                <DefaultFooter/>
            </div>
        </div>
    );
}