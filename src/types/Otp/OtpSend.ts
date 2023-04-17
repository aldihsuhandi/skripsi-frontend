import { ResultContext } from "../ResultContext";

export interface OtpSendProps {
  email: string;
  otpType: "USER_ACTIVATION" | "FORGOT_PASSWORD";
}

export interface OtpSendResult {
  resultContext: ResultContext;
}
