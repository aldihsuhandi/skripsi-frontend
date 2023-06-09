import { APIResultTemplate } from "../ResultContext";

export interface TransactionItem {
  itemId: string;
  quantity: number;
}

export interface TransactionCreateRequest {
  items: TransactionItem[];
}

export interface TransactionCreateResult extends APIResultTemplate {
  transactionId: string;
}
