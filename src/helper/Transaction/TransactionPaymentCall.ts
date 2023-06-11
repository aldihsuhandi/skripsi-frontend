import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import {
  TransactionPaymentRequest,
  TransactionPaymentResult,
} from "@/types/Transaction";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const TransactionPayment = async ({
  transactionId,
  paymentType,
}: TransactionPaymentRequest) => {
  const session = CheckExistSessionLocal();
  if (!session) {
    return;
  }

  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    sessionId: session,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const config = {
    headers: headers,
  };

  const result = await PostCall<TransactionPaymentResult>({
    url: BE_URL + "/transaction/payment",
    config: config,
    body: {
      transactionId: transactionId,
      paymentType: paymentType,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};
