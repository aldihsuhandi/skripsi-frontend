import axios from "axios";

import {
  BE_URL,
  ItemFilterContext,
  ItemQueryResult,
  Session_Local_Key,
} from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { PostCall } from "./PostCall";

export const ItemQuery = async (itemFilterContext: ItemFilterContext) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const sessionString = localStorage.getItem(Session_Local_Key);
  if (sessionString) {
    Object.assign(headers, { sessionId: sessionString });
  }

  const config = {
    headers: headers,
  };

  const result = await PostCall<ItemQueryResult>({
    url: BE_URL + "/item/query",
    config: config,
    body: { itemFilterContext },
  });

  if (result?.resultContext.success) {
    return result;
  }
};
