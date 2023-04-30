import axios from "axios";

import { WishlistQueryResult } from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal, CheckSessionValid } from "../SessionHelper";

export const WishlistAdd = async ({ itemId }: { itemId: string }) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const validSession = await CheckSessionValid(sessionString);
    if (validSession) {
      Object.assign(headers, { sessionId: sessionString });
    }
  }

  const { data } = await axios.post<WishlistQueryResult>(
    "http://localhost:8080/item/wishlist/add",
    {
      itemId,
    },
    {
      headers: headers,
    }
  );

  return data;
};
