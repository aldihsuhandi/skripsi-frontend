import { ResultContext } from "../ResultContext";

//Form Values
export interface ResetPassSendFormValues {
  email: string;
}

//Request

/* 
>>> Di Headers:
    cliendId
    clientSecret
*/

//Result
export interface ResetPassSendResult {
  resultContext: ResultContext;
}
