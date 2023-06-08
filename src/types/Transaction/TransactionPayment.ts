import { APIResultTemplate } from "../ResultContext";

export interface TransactionPaymentRequest {
  transactionId: string;
  paymentType: string; // dari Dictionary tho
}

export interface TransactionPaymentResult extends APIResultTemplate {
  paymentNumber: number;
}

export interface PaymentTypeFormValues {
  paymentType: string;
}
