import { ItemQueryHead } from "./ItemQueryHead";
import { ResultContext } from "./ResultContext";

// Request

export interface ItemAutoCompleteRequest {
  head: Pick<ItemQueryHead, "clientId" | "clientSecret">;
  body: {
    autocomplete: string;
  };
}

// Result
export interface ItemAutoCompleteResult {
  resultContext: ResultContext;
  itemName: string[];
}
