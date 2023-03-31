// Ini mending di pisah, di wishlist pake juga
export interface ItemFilterContext {
  itemId?: string;
  itemName?: string;
  minItemPrice?: number;
  maxItemPrice?: number;
  merchantEmail?: string;
  merchantInterestLevel?: string;
  userInterestLevel?: string;
  hobby?: string;
  itemCategory?: string;
  isApproved?: boolean;
}
