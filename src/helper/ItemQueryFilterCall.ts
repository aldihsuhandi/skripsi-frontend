import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemQueryResult,
  Session_Local_Key,
} from "@/types";
import { ItemFilterValues } from "@/types/ItemFilter";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";

export const ItemFilterQuery = async ({
  sorting,
  sortingType,
  filters,
  pageNumber,
  numberOfItem,
}: {
  sorting?: string;
  sortingType?: string;
  filters: ItemFilterValues;
  pageNumber?: number;
  numberOfItem?: number;
}) => {
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
    url: "https://shumishumi-be-dot-moonlit-helper-388513.et.r.appspot.com/item/query",
    config: config,
    body: {
      sorting: sorting ? sorting : undefined,
      sortingType: sortingType ? sortingType : undefined,
      pageNumber: pageNumber,
      numberOfItem: numberOfItem,
      itemFilterContext: {
        itemName: filters.itemName,
        minItemPrice: filters.pMin,
        maxItemPrice: filters.pMax,
        hobby: filters.hob,
        itemCategory: filters.itemCat,
        merchantEmail: filters.merchantEmail,
        merchantInterestLevel: filters.inLevMerchant,
        userInterestLevel: filters.inLevUser,
      },
    },
  });

  if (result?.resultContext.success) {
    return result;
  } else {
    toast.error(
      "We were unable to process your search request, please try again later!",
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      }
    );
  }
};
