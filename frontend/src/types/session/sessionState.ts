import {User} from "./user.ts";
import {Accesses} from "./accesses.ts";
import {Role} from "./role.ts";


export interface SessionState {
    user: User;
    valid: boolean;
    accesses: Accesses[];
    roles: Role[];
}