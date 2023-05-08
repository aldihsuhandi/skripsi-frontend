import axios from "axios";

import { ItemQueryResult } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal, CheckSessionValid } from "./SessionHelper";

export const ItemFilterQuery = async (filters: ItemFilterValues) => {
  const headers = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    "Content-Type": "application/json",
    "Accept-Type": "application/json",
  };

  // Check klo ada gk session local
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const validSession = await CheckSessionValid(sessionString);
    if (validSession) {
      Object.assign(headers, { sessionId: sessionString });
    }
  }

  const { data } = await axios.post<ItemQueryResult>(
    "http://localhost:8080/item/query",
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
