import {ApiResponse} from "../types/apiResponse.ts";

export function isApiResponse<T>(res: unknown): res is ApiResponse<T> {
    return typeof res === "object" && res !== null && "success" in res;
}