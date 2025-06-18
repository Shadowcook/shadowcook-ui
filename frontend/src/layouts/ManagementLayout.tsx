import '../App.css';
import {Outlet} from "react-router-dom";
import {MessageProvider} from '../context/MessageProvider.tsx';
import {DefaultHeader} from "./elements/DefaultHeader.tsx";
import {ManagementNavigation} from "../components/administration/page/ManagementNavigation.tsx";
import {DefaultFooter} from "./elements/DefaultFooter.tsx";

export default function ManagementLayout() {

    return (
        <MessageProvider>
            <div id="rootContent">
                <DefaultHeader showCreateRecipe={false} showUserMenu={true}/>
                <div className="main">
                    <div id="categoryFrame">
                        <div className="categoryFrame">
                            <ManagementNavigation/>
                        </div>
                    </div>
                    <div id="managementFrame">
                        <Outlet/>
                    </div>
                </div>
                <div id="footerFrame">
                    <DefaultFooter/>
                </div>
            </div>
        </MessageProvider>
    )
}
