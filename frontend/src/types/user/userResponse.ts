import {ApiResponse} from "../apiResponse.ts";
import {User} from "@project-types/user/user.ts";

export interface UserResponse extends ApiResponse<User> {
    users: User[];
}