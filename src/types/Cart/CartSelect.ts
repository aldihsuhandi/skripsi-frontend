import { APIResultTemplate } from "../ResultContext";

export interface CartSelectRequest {
  itemIds: string[];
  selected: boolean;
}

export interface CartSelectResult extends APIResultTemplate {
  selected: boolean;
}
