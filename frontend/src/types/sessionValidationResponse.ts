import {ApiResponse} from "./apiResponse.ts";
import {SessionState} from "./sessionState.ts";

export interface SessionValidationResponse extends ApiResponse<SessionState> {
    session: SessionState;
}

