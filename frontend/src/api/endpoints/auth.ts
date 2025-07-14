import {SessionValidationResponse} from "@project-types/user/session/sessionValidationResponse.ts";
import {AuthResponse} from "@project-types/user/session/authResponse.ts";
import {User} from "@project-types/user/user.ts";
import {UserResponse} from "@project-types/user/userResponse.ts";
import {ApiBaseResponse} from "@project-types/apiBaseResponse.ts";
import {setAccessToken} from "../../auth/accessTokenStore.ts";
import {apiGet} from "@api/apiRequest.ts";
import authClient from "@api/authClient.ts";

export async function validateLogin(): Promise<SessionValidationResponse> {
    console.log("Validating contexts");
    const res = apiGet<SessionValidationResponse>('/session/validate');
    console.log('validateLogin → /contexts/validate responded with: ', res);
    return res;
}

export async function logout(): Promise<SessionValidationResponse> {
    console.log("Logging out of contexts");
    return await apiGet<SessionValidationResponse>('/logout');
}

export async function loginUser(username: string, password: string): Promise<AuthResponse | null> {
    if (username != null && password != null) {
        const res = await authClient.get<AuthResponse>(`/login/${username}/${password}`);
        console.log("Login attempt: ",res);
        if (res.data.success) {
            setAccessToken(res.data.accessToken);
        }
        return res.data;
    } else {
        return null;
    }
}

export async function validateUserToken(username: string, token: string): Promise<User | null> {
    if (username != null && token != null) {
        const res = await apiGet<UserResponse>(`/validateUserToken/${username}/${token}`);
        console.log('validateUserToken <UNK> /contexts/validate', res);
        return res.users[0];
    } else {
        return null;
    }
}

export async function pushUserPassword(username: string, token: string, newPasswordBase64: string): Promise<boolean | null> {
    if (username != null && token != null) {
        const res = await apiGet<ApiBaseResponse>(`/resetUserPassword/${username}/${token}/${newPasswordBase64}`);
        console.log("pushing new user password");
        return res.success;
    } else {
        return null;
    }
}

export async function pushPasswordReset(user: User): Promise<UserResponse | null> {
    if (user && user.id > -1) {
        console.log(`Generating new password token for user ${user.id}`);
        return await apiGet<UserResponse>(`/userPasswordReset/${user.id}`);
    } else {
        return null;
    }
}