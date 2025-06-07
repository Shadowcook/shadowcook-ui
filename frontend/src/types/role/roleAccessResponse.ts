import {ApiResponse} from "../apiResponse.ts";
import {RoleAccess} from "./roleAccess.ts";


export interface RoleAccessResponse extends ApiResponse<RoleAccess> {
    roleAccess: RoleAccess[];
}