import { ResultContext } from "../ResultContext";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId
 */

export interface LogoutRequest {
  sessionId: string;
}

// Result / Response

export interface LogoutResult {
  resultContext: ResultContext;
}
