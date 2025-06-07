import {User} from "../user.ts";
import {Accesses} from "../../role/accesses.ts";
import {Role} from "../../role/role.ts";


export interface SessionState {
    user: User;
    valid: boolean;
    accesses: Accesses[];
    roles: Role[];
}