import {ApiResponse} from "../apiResponse.ts";
import {Role} from "./role.ts";

export interface RoleResponse extends ApiResponse<Role> {
    roles: Role[];
}