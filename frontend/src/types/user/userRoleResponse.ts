import {ApiResponse} from "../apiResponse.ts";
import {UserRole} from "@project-types/user/userRole.ts";

export interface UserRoleResponse extends ApiResponse<UserRole> {
    userRole: UserRole[];
}