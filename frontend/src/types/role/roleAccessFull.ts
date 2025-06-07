import {Access} from "./access.ts";
import {Role} from "./role.ts";

export interface RoleAccessFull {
    access: Access;
    role: Role;
}