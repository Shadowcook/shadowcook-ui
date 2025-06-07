import {ApiRequest} from "../apiRequest.ts";
import {Role} from "./role.ts";

export interface RoleRequest extends ApiRequest<Role> {
    roles: Role[];
}