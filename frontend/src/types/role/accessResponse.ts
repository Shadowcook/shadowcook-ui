import {ApiResponse} from "../apiResponse.ts";
import {Access} from "./access.ts";


export interface AccessResponse extends ApiResponse<Access[]> {
    access: Access[];
}