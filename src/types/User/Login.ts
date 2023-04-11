import { ResultContext } from "../ResultContext";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 */

export interface LoginRequest {
  email: string;
  password: string;
  // isRemembered?: boolean;
}

// Result / Response
export interface LoginResult {
  resultContext: ResultContext;
  sessionId: string;
}
