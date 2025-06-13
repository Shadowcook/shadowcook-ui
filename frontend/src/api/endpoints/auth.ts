import {SessionValidationResponse} from "@project-types/user/session/sessionValidationResponse.ts";
import apiClient from "../axios.ts";
import {AuthResponse} from "@project-types/user/session/authResponse.ts";
import {User} from "@project-types/user/user.ts";
import {UserResponse} from "@project-types/user/userResponse.ts";
import {ApiBaseResponse} from "@project-types/apiBaseResponse.ts";

export async function validateLogin(): Promise<SessionValidationResponse> {
    console.log("Validating session");
    const res = await apiClient.get<SessionValidationResponse>('/session/validate');
    console.log('validateLogin → /session/validate responded with: ', res.data);
    return res.data;
}

export async function logout(): Promise<SessionValidationResponse> {
    console.log("Logging out of session");
    const res = await apiClient.get<SessionValidationResponse>('/logout');
    return res.data;
}

export async function loginUser(username: string, password: string): Promise<AuthResponse | null> {
    if (username != null && password != null) {
        const res = await apiClient.get<AuthResponse>(`/login/${username}/${password}`);
        return res.data;
    } else {
        return null;
    }
}

export async function validateUserToken(username: string, token: string): Promise<User | null> {
    if (username != null && token != null) {
        const res = await apiClient.get<UserResponse>(`/validateUserToken/${username}/${token}`);
        console.log('validateUserToken <UNK> /session/validate', res);
        return res.data.users[0];
    } else {
        return null;
    }
}

export async function pushUserPassword(username: string, token: string, newPasswordBase64: string): Promise<boolean | null> {
    if (username != null && token != null) {
        const res = await apiClient.get<ApiBaseResponse>(`/resetUserPassword/${username}/${token}/${newPasswordBase64}`);
        console.log("pushing new user password");
        return res.data.success;
    } else {
        return null;
    }
}

export async function pushPasswordReset(user: User): Promise<UserResponse | null> {
    if (user && user.id > -1) {
        console.log(`Generating new password token for user ${user.id}`);
        const res = await apiClient.get<UserResponse>(`/userPasswordReset/${user.id}`);
        return res.data;
    } else {
        return null;
    }
}