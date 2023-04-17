import { boolean, string } from "yup";
import { ResultContext } from "../ResultContext";

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 *  sessionId
 */

// sessionId di header
export interface SessionInfoRequest {
  sessionId: string;
}

// Result / Respone

export interface SessionSummary {
  email: string;
  isRemembered: boolean;
  sessionDt: Date;
}

export interface SessionInfoResult {
  sessionSummary: SessionSummary;
  resultContext: ResultContext;
}
