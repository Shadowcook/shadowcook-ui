import {ApiResponse} from "../../apiResponse.ts";

export interface AuthResponse extends ApiResponse<string> {
    accessToken: string;
}