import {SessionValidationResponse} from "../../types/session/sessionValidationResponse.ts";
import apiClient from "../axios.ts";
import {AuthResponse} from "../../types/session/authResponse.ts";

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