export interface ItemFilterValues {
  itemName: string;
  pMin?: number;
  pMax?: number;
  hob?: string;
  itemCat?: string;
  inLevMerchant?: string;
  inLevUser?: string;
}

export interface ItemFilterFormValues {
  pMin?: string;
  pMax?: string;
  sortType?: string;
  itemSort?: string;
  hob?: string;
  itemCat?: string;
  inLevMerchant?: string;
  inLevUser?: string;
}

export interface WishlistFilterFormValues {
  pMin?: string;
  pMax?: string;
  hob?: string;
  itemCat?: string;
  inLevMerchant?: string;
  inLevUser?: string;
}
