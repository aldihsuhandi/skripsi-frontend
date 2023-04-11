import { ResultContext } from "../ResultContext";

// Request

/**
 * Di Headers:
 *  clientId
 *  clientSecret
 */

export interface ItemAutoCompleteRequest {
  autocomplete: string;
}

// Result
export interface ItemAutoCompleteResult {
  resultContext: ResultContext;
  itemName: string[];
}
