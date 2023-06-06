import { APIResultTemplate } from "../ResultContext";

export interface ItemDeleteRequest {
  itemId: string;
}

export interface ItemDeleteResult extends APIResultTemplate {}
