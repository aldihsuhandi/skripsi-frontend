// Ini mending di pisah, di wishlist pake juga
export interface ItemFilterContext {
  itemName?: string;
  minItemPrice?: number;
  maxItemPrice?: number;
  merchantEmail?: string;
  merchantInterestLevel?: string;
  userInterestLevel?: string;
  hobby?: string;
  itemCategory?: string;
}
