import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "../../types/session/accessId.ts";



export function ManagementHome() {
    const session = useSession();
    if (!validateAccess(session, AccessId.ADMIN)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <></>
    );
}