import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "../../types/session/accessId.ts";



export function UserManagement() {
    const session = useSession();
    if (!validateAccess(session, AccessId.EDIT_USER)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <></>
    );
}