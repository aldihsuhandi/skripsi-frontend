import {
  CLIENT_ID,
  CLIENT_SECRET,
  TransactionCancelResult,
  TransactionFinishResult,
} from "@/types";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const TransactionCancel = async (id: string) => {
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

  const result = await PostCall<TransactionCancelResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/transaction/cancel",
    config: config,
    body: {
      transactionId: id,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};
