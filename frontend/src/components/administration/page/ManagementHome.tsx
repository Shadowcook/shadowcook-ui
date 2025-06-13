import {useSession} from "../../../session/SessionContext.tsx";
import {validateAnyAccess} from "../../../utilities/validate.ts";
import {MANAGEMENT_ACCESS_IDS} from "@project-types/role/accessId.ts";


export function ManagementHome() {
    const session = useSession();
    if (!validateAnyAccess(session, MANAGEMENT_ACCESS_IDS)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <></>
    );
}