import { ResultContext } from "../ResultContext";

//Form Values
export interface ForgotPassFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

//Request

/* 
>>> Di Headers:
    cliendId
    clientSecret
*/

export interface ForgotPassRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

//Result
export interface ForgotPassResult {
  resultContext: ResultContext;
}
