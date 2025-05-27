import {Link, Outlet} from "react-router-dom";
import ShadowCookIcon from "../assets/icon.png";
import ShadowCookTextLogo from "../assets/ShadowCook_text_alpha.png";
import '../App.css';


export default function Logout() {
    return (
        <div id="rootContent">
            <div id="headerFrame">
                <div className="header-left">
                    <Link to="/"><img src={ShadowCookIcon} alt="Shadowcook Logo" className="logo"/></Link>
                </div>
                <div className="header-center">
                    <Link to="/"><img src={ShadowCookTextLogo} alt="SHADOWCOOK" className="text-logo"/></Link>
                </div>
                <div className="header-right">

                </div>
            </div>
            <div id="breadcrumbFrame" className="bg-gray-100 p-2">

            </div>
            <div className="main">
                {/*<div id="categoryFrame">*/}
                {/*    <div className="categoryFrame">*/}
                {/*        <CategoryBrowser categories={categories}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div id="recipeFrame">
                    <Outlet />
                </div>
            </div>
            <div id="footerFrame">&copy; 2019-{new Date().getFullYear()} by Shadowsoft</div>
        </div>
    );
}