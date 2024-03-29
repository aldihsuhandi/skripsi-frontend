import { BE_URL, CLIENT_ID, CLIENT_SECRET } from "@/types";
import { TransactionCreateResult } from "@/types/Transaction";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const TransactionCreate = async () => {
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

  const result = await PostCall<TransactionCreateResult>({
    url: BE_URL + "/transaction/create",
    config: config,
    body: {
      fromCart: true,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};
