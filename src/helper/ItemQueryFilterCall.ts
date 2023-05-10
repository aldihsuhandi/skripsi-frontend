import axios from "axios";

import { ItemQueryResult } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal } from "./SessionHelper";
import { toast } from "react-toastify";

export const ItemFilterQuery = async (filters: ItemFilterValues) => {
  try {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
    };

    // Check klo ada gk session local
    const sessionString = CheckExistSessionLocal();
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
          merchantInterestLevel: filters.inLevMerchant,
          userInterestLevel: filters.inLevUser,
        },
      },
      {
        headers: headers,
      }
    );

    return data;
  } catch (error) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
