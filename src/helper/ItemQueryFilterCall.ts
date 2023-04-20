import axios from "axios";

import { ItemQueryResult, Session_Local_Key } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";

export const ItemFilterQuery = async (filters: ItemFilterValues) => {
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

  const { data } = await axios.post<ItemQueryResult>(
    "http://localhost:8080/item/query",
    {
      itemFilterContext: {
        itemName: filters.itemName,
        minItemPrice: filters.pMin,
        maxItemPrice: filters.pMax,
        hobby: filters.hob,
        itemCategory: filters.itemCat,
        merchantInterestLevel: filters.inLev,
      },
    },
    {
      headers: headers,
    }
  );

  return data;
};
