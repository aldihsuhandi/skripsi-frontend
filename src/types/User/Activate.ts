import { ResultContext } from "../ResultContext";

// Form Values
export interface ActivateFormValues {
  otpCode: string;
}

// Request

/**
 * Di headers:
 *  clientId
 *  clientSecret
 */

export interface ActivateRequest {
  email: string;
  otp: string;
}

// Result
export interface ActivateResult {
  resultContext: ResultContext;
}
