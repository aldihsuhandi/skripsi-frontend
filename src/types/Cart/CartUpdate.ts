import { APIResultTemplate } from "../ResultContext";

export interface CartUpdateRequest {
  itemId: string;
  quantity: number;
}

export interface CartUpdateResult extends APIResultTemplate {}
