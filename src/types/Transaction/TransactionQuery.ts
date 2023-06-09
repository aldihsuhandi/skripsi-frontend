import { HistoryItemSummary, PagingContext } from "../Item";
import { APIResultTemplate } from "../ResultContext";

export interface TransactionQueryResult extends APIResultTemplate {
  pagingContext: PagingContext;
  transactions: TransactionSummary[];
}

export interface TransactionDetailResult extends APIResultTemplate {
  transaction: TransactionSummary;
}

export interface TransactionSummary {
  transactionId: string;
  price: bigint;
  status: string;
  paymentType: string;
  paymentCode: string;
  details: Map<string, TransactionDetailSummary[]>;
  gmtCreate: string;
  gmtModified: Date;
}

export interface TransactionDetailSummary {
  item: HistoryItemSummary;
  quantity: number;
}
