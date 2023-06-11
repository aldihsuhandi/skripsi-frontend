import { CLIENT_ID, CLIENT_SECRET, WishlistQueryResult } from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const WishlistQuery = async ({
  filters,
  pageNumber,
  numberOfItem,
}: {
  filters: ItemFilterValues;
  pageNumber?: number;
  numberOfItem?: number;
}) => {
  const sessionString = CheckExistSessionLocal();
  if (sessionString) {
    const headers = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      "Content-Type": "application/json",
      "Accept-Type": "application/json",
      sessionId: sessionString,
    };

    const config = {
      headers: headers,
    };

    const result = await PostCall<WishlistQueryResult>({
      url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/item/wishlist/query",
      config: config,
      body: {
        pageNumber: pageNumber,
        numberOfItem: numberOfItem,
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
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when fetching wishlist data, please try again later.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to query wishlist!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
