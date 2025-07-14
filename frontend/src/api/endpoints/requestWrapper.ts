import apiClient from "@api/apiClient.ts";
import {ApiResponse} from "@project-types/apiResponse.ts";
import {ERROR_CODES, ErrorCode} from "../../constants/errorCodes.ts";
import {Auth} from "@project-types/user/session/auth.ts";

export async function getRequest<T>(url: string): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(url);
    if(hasError(response.data, ERROR_CODES.INVALID_TOKEN)) {
        return response.data as T;
    } else {
        await apiClient.get<Auth>('/refresh');
    }
    return response.data as T;
}

function hasError<T>(response: ApiResponse<T>, code: ErrorCode): boolean {
    return response.errors.includes(code);
}