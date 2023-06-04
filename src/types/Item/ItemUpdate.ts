import { APIResultTemplate } from "../ResultContext";

export interface ItemUpdateContext {
  itemName?: string;
  itemPrice?: number;
  itemDescription?: string;
  itemQuantity?: number;
  categoryName?: string;
  hobbyName?: string;
  merchantInterestLevel?: string;
  addedImage?: string[];
  removedImage?: string[];
}

export interface ItemUpdateRequest {
  itemId: string;
  itemUpdateContext: ItemUpdateContext;
}

export interface ItemUpdateResult extends APIResultTemplate {}

// form

export interface ItemUpdateFormValues {
  itemName?: string;
  itemPrice?: number;
  itemDescription?: string;
  itemQuantity?: number;
  categoryName?: string;
  hobbyName?: string;
  merchantInterestLevel?: string;
  addedImage?: File[];
  removedImage?: string[];
}
