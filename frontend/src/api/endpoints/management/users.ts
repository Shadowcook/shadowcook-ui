import apiClient from "@api/apiClient.ts";
import {User} from "@project-types/user/user.ts";
import {UserResponse} from "@project-types/user/userResponse.ts";
import {generateRandomString, isValidId} from "../../../utilities/validate.ts";
import {UserRoleResponse} from "@project-types/user/userRoleResponse.ts";
import {UserRole} from "@project-types/user/userRole.ts";
import {UserRoleRequest} from "@project-types/user/userRoleRequest.ts";
import {RoleResponse} from "@project-types/role/roleResponse.ts";

export async function fetchAllUsers(): Promise<User[]> {
    try {
        console.log("fetching users");
        const res = await apiClient.get<UserResponse>('/getAllUsers');
        console.log("retrieved user data: ", res);
        return [...res.data.users].sort((a, b) =>
            a.login.localeCompare(b.login, undefined, {numeric: true, sensitivity: 'base'})
        );
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

export async function pushUser(user: User): Promise<UserResponse> {
    try {
        const userPassword = generateRandomString();
        const userRequest = {
            password: userPassword,
            user: user,
        }
        console.log("Saving user...", user);
        const res = await apiClient.post('/pushUser', userRequest, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log("User saved:", res.data);
        return res.data;
    } catch (error) {
        console.error("Failed to save user:", error);
        throw error;
    }
}

export async function pushUserRoles(request: UserRoleRequest): Promise<User | null> {
    try {
        console.log("Saving user roles...", request);
        const res = await apiClient.post('/pushUserRoles', request, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log("User roles saved:", res.data);
        return res.data.user[0];
    } catch (error) {
        console.error("Failed to save user roles:", error);
        return null;
    }
}

export async function deleteUserRoles(userId: number): Promise<RoleResponse> {
    try {
        console.log(`deleting user role ${userId}`);
        const res = await apiClient.get<RoleResponse>(`/deleteUserRole/${userId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(userId: number): Promise<UserResponse> {
    console.log(`deleting user ${userId}`);
    const res = await apiClient.get<UserResponse>(`/deleteUser/${userId}`);
    return res.data;
}

