import {RoleAccessFull} from "./roleAccessFull.ts";
import {ApiResponse} from "../apiResponse.ts";


export interface RoleAccessFullResponse extends ApiResponse<RoleAccessFull> {
    rolesAccess: RoleAccessFull[];
}
