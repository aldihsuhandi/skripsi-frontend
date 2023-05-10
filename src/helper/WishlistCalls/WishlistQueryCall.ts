import axios from "axios";

import { CLIENT_ID, CLIENT_SECRET, WishlistQueryResult } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { toast } from "react-toastify";
import { CheckExistSessionLocal } from "../SessionHelper";

export const WishlistQuery = async (filters: ItemFilterValues) => {
  try {
    const sessionString = CheckExistSessionLocal();
    if (sessionString) {
      const headers = {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        "Content-Type": "application/json",
        "Accept-Type": "application/json",
        sessionId: sessionString,
      };
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
    } else {
      toast.error("You need to be logged in to query wishlist!", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
      return undefined;
    }
  } catch (error) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
