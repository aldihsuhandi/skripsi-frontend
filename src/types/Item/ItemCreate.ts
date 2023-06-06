import { APIResultTemplate } from "../ResultContext";

export type MerchantLevelTypes = "BEGINNER" | "INTERMEDIATE" | "ENTHUSIAST";
export const MerchantLevelConst = ["BEGINNER", "INTERMEDIATE", "ENTHUSIAST"];

export interface ItemCreateRequest {
  itemName: string;
  itemPrice: number;
  itemDescription: string;
  itemQuantity: number;
  categoryName: string;
  hobbyName: string;
  merchantInterestLevel: string;
  itemImages: string[];
}

export interface ItemCreateResult extends APIResultTemplate {
  itemId: string;
}

// form

export interface ItemCreateFormValues {
  itemName: string;
  itemPrice: number;
  itemDescription: string;
  itemQuantity: number;
  categoryName: string;
  hobbyName: string;
  merchantInterestLevel: string;
  itemImages: File[];
}
