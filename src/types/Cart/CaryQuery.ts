import { APIResultTemplate, ItemSummary, PagingContext } from "../Item";

export interface CartQueryRequest {
  pageNumber?: number;
  numberOfItems?: number;
}

export interface CartSummary {
  quantity: number;
  itemSummary: ItemSummary;
  selected: boolean;
}

export interface CartQueryResult extends APIResultTemplate {
  pagingContext: PagingContext;
  carts: CartSummary[];
  price: bigint;
}
