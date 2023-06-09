import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal } from "../SessionHelper";
import { PostCall } from "../PostCall";
import {
  TransactionDetailResult,
  TransactionQueryResult,
} from "@/types/Transaction/TransactionQuery";

export const TransactionQuery = async (status: string, page: number) => {
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

  const result = await PostCall<TransactionQueryResult>({
    url: "http://localhost:8080/transaction/query",
    config: config,
    body: {
      status: status,
      pageNumber: page,
      numberOfItems: 10,
    },
  });

  if (result && result.resultContext.success) {
    return result;
  }
};

export const TransactionDetail = async (id: string) => {
  const session = CheckExistSessionLocal();
  console.log("session: " + session);
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

  const result = await PostCall<TransactionDetailResult>({
    url: "http://localhost:8080/transaction/detail",
    config: config,
    body: {
      transactionId: id,
    },
  });

  return result;
};
