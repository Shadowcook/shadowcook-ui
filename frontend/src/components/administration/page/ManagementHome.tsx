import {useSession} from "../../../contexts/SessionContext.tsx";
import {validateAnyAccess} from "../../../utilities/validate.ts";
import {MANAGEMENT_ACCESS_IDS} from "@project-types/role/accessId.ts";
import {usePageTitle} from "../../../contexts/pageTitleContext.tsx";


export function ManagementHome() {
    const session = useSession();
    usePageTitle("Administration");
    if (!validateAnyAccess(session, MANAGEMENT_ACCESS_IDS)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <></>
    );
}