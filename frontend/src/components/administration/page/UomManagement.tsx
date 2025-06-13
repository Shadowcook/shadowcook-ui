import {useSession} from "../../../session/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";



export function UomManagement() {
    const session = useSession();
    if (!validateAccess(session, AccessId.EDIT_UOM)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <></>
    );
}