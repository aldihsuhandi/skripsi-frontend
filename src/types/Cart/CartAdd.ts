import { APIResultTemplate } from "../ResultContext";

export interface CartAddRequest {
  itemId: string;
  quantity: number;
}

export interface CartAddResult extends APIResultTemplate {}
