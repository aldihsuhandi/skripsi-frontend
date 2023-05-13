import { ResultContext } from "../ResultContext";

//Request
export interface ResetPassSendRequest {
  email: string;
}

/* 
>>> Di Headers:
    cliendId
    clientSecret
*/

//Result
export interface ResetPassSendResult {
  resultContext: ResultContext;
}
