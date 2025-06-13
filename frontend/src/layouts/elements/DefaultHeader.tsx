import {Link} from "react-router-dom";
import ShadowCookIcon from "../../assets/icon.png";
import ShadowCookTextLogo from "../../assets/ShadowCook_text_alpha.png";
import {UserMenu} from "../../components/user/UserMenu.tsx";
import React from "react";

interface DefaultHeaderProps {
    showCreateRecipe: boolean;
    showUserMenu: boolean;
}

export const DefaultHeader: React.FC<DefaultHeaderProps> = ({
                                                                showCreateRecipe,
                                                                showUserMenu,
                                                            }) => {

    let userMenu;

    if(showUserMenu) {
        userMenu = <UserMenu showCreateRecipe={showCreateRecipe} />;
    } else {
        userMenu = <></>
    }

    return (
        <div id="headerFrame">
            <div className="header-left">
                <Link to="/"><img src={ShadowCookIcon} alt="Shadowcook Logo" className="logo"/></Link>
            </div>
            <div className="header-center">
                <Link to="/"><img src={ShadowCookTextLogo} alt="SHADOWCOOK" className="text-logo"/></Link>
            </div>
            <div className="header-right">
                {userMenu}
            </div>
        </div>
    );

}
