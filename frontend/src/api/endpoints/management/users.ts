import apiClient from "@api/axios.ts";
import {User} from "@project-types/user/user.ts";
import {UserResponse} from "@project-types/user/userResponse.ts";
import {isValidId} from "../../../utilities/validate.ts";
import {UserRoleResponse} from "@project-types/user/userRoleResponse.ts";
import {UserRole} from "@project-types/user/userRole.ts";

export async function fetchAllUsers(): Promise<User[]> {
    try {
        console.log("fetching users");
        const res = await apiClient.get<UserResponse>('/getAllUsers');
        console.log("retrieved role data: ", res);
        console.log("fetched " + res.data.length + " roles");
        return res.data.users
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function fetchUserRoles(userId: number): Promise<UserRole[]> {
    try {
        console.log("fetching users");
        if (isValidId(userId)) {
            const res = await apiClient.get<UserRoleResponse>(`/getUserRoles/${userId}`);
            console.log("retrieved user role data: ", res);
            console.log("fetched " + res.data.length + " user roles");
            return res.data.userRole;
        }
    } catch (error) {
        console.error(error);
    }
    return [];
}

