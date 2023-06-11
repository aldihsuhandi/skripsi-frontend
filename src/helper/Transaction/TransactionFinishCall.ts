import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal } from "../SessionHelper";
import { PostCall } from "../PostCall";
import { TransactionFinishResult } from "@/types/Transaction/TransactionFinish";

export const TransactionFinish = async (id: string) => {
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

  const result = await PostCall<TransactionFinishResult>({
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/transaction/finish",
    config: config,
    body: {
      transactionId: id,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};
