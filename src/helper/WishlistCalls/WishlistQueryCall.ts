import axios from "axios";

import { WishlistQueryResult } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal, CheckSessionValid } from "../SessionHelper";

export const WishlistQuery = async (filters: ItemFilterValues) => {
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
    "http://localhost:8080/item/wishlist/query",
    {
      itemFilterContext: {
        itemName: filters.itemName,
        minItemPrice: filters.pMin,
        maxItemPrice: filters.pMax,
        hobby: filters.hob,
        itemCategory: filters.itemCat,
        merchantInterestLevel: filters.inLevMerchant,
        userInterestLevel: filters.inLevUser,
      },
    },
    {
      headers: headers,
    }
  );

  return data;
};
