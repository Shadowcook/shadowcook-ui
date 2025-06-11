import {User} from "@project-types/user/user.ts";

export interface UserRequest {
    password: string;
    user: User;
}