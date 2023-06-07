import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal } from "../SessionHelper";
import { PostCall } from "../PostCall";
import { TransactionFinishResult } from "@/types/Transaction/TransactionFinish";

export const TransactionFinish = async (id: strign) => {
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
    url: "http://localhost:8080/transaction/finish",
    config: config,
    body: {
      transactionId: id,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};
