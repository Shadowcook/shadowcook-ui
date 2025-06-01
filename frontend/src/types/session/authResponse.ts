import {ApiResponse} from "../apiResponse.ts";
import {Auth} from "./auth.ts";

export interface AuthResponse extends ApiResponse<Auth> {
    auth: Auth;
}