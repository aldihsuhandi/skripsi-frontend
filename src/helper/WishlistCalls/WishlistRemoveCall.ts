import axios from "axios";

import { WishlistAddResult } from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal, CheckSessionValid } from "../SessionHelper";

export const WishlistRemove = async ({ itemId }: { itemId: string }) => {
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

  const { data } = await axios.post<WishlistAddResult>(
    "http://localhost:8080/item/wishlist/remove",
    {
      itemId,
    },
    {
      headers: headers,
    }
  );

  return data;
};
