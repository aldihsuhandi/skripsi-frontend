import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemDetailRequest,
  ItemDetailResult,
  Session_Local_Key,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";

export const ItemDetail = async (itemId: ItemDetailRequest) => {
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

  const result = await PostCall<ItemDetailResult>({
    url: "http://localhost:8080/item/query/detail",
    config: config,
    body: itemId,
  });

  if (result?.resultContext.success) {
    return result;
  } else if (result?.resultContext.resultCode === "ITEM_NOT_FOUND") {
    toast.error("The Item does not exist!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  } else {
    toast.error(
      "An Error Occured when fetching this item's data, please try again.",
      {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      }
    );
  }
};
