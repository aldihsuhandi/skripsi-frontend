import { ResultContext } from "./ResultContext";

/**
 * Di Headers:
 *  clientId
 *  clientSecret
 */

export type dictionaryKey =
  | "INTEREST_LEVEL"
  | "CATEGORY"
  | "HOBBY"
  | "ITEM_SORTING"
  | "SORTING_TYPE"
  | "PAYMENT";

export interface FilterDictionaryRequestBody {
  dictionaryKey: dictionaryKey;
}

export interface FilterDictionaryResult {
  resultContext: ResultContext;
  dictionaries: string[];
}
