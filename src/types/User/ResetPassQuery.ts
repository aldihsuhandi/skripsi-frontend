import { ResultContext } from "../ResultContext";

//Request

/* 
>>> Di Headers:
    cliendId
    clientSecret
*/

export interface ResetPassQueryRequest {
  uuid: string;
}

//Response/Result

export interface ResetPassQueryResult {
  email: string;
  resultContext: ResultContext;
}
