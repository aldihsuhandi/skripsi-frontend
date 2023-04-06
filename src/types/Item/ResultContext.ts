// Possible hasil result code dari BE
export type possibleResultCode =
  | "SUCCESS"
  | "PARAM_ILLEGAL"
  | "SYSTEM_ERROR"
  | "SESSION_EXPIRED";

export interface ResultContext {
  success: boolean;
  resultMsg: string;
  resultCode: string;
}
