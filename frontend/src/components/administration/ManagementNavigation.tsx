import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess, validateAnyAccess} from "../../utilities/validate.ts";
import {AccessId, MANAGEMENT_ACCESS_IDS} from "@types/user/accessId.ts";
import {Link} from "react-router-dom";
import userManagementIcon from "../../assets/font-awesome/solid/users.svg";
import roleManagementIcon from "../../assets/font-awesome/solid/id-card.svg";
import uomManagementIcon from "../../assets/font-awesome/solid/scale-balanced.svg";
import categoryManagementIcon from "../../assets/font-awesome/solid/folder-tree.svg";

// import React from "react";

export function ManagementNavigation() {
    const session = useSession();
    if (!validateAnyAccess(session, MANAGEMENT_ACCESS_IDS)) {
        return (<>ACCESS DENIED</>);
    }

    let userManagement = (<></>);
    let roleManagement = (<></>);
    let uomManagement = (<></>);
    let categoryManagement = (<></>);

    if (validateAccess(session, AccessId.EDIT_USER)) {
        userManagement = (
            <>
                <Link className="linkButtonLink" to={`/management/users`}>
                    <div className="linkButton">
                        <img src={userManagementIcon} alt="users"/> <span>Users</span>
                    </div>
                </Link>
            </>
        )
    }

    if (validateAccess(session, AccessId.ADMIN)) {
        roleManagement = (
            <>
                <Link className="linkButtonLink" to={`/management/roles`}>
                    <div className="linkButton">
                        <img src={roleManagementIcon} alt="ID Card"/> <span>Roles</span>
                    </div>
                </Link>
            </>
        )
    }

    if (validateAccess(session, AccessId.EDIT_UOM)) {
        uomManagement = (
            <>
                <Link className="linkButtonLink" to={`/management/uoms`}>
                    <div className="linkButton">
                        <img src={uomManagementIcon} alt="Scale"/> <span>Units of measure</span>
                    </div>
                </Link>
            </>
        )
    }

    if (validateAccess(session, AccessId.EDIT_CATEGORY)) {
        categoryManagement = (
            <>
                <Link className="linkButtonLink" to={`/management/categories`}>
                    <div className="linkButton">
                        <img src={categoryManagementIcon} alt="Folder tree"/> <span>Categories</span>
                    </div>
                </Link>
            </>
        )
    }

    return (
        <>
            <div className="linkButtonFrame">
                {userManagement}
                {roleManagement}
                {categoryManagement}
                {uomManagement}
            </div>
        </>
    );
}