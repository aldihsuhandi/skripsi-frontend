import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemDeleteRequest,
  ItemDeleteResult,
  Session_Local_Key,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "./PostCall";

export const ItemDelete = async (itemId: ItemDeleteRequest) => {
  const sessionString = localStorage.getItem(Session_Local_Key);
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

    const result = await PostCall<ItemDeleteResult>({
      url: "http://localhost:8080/item/delete",
      config: config,
      body: itemId,
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when deleting this item's data, please try again.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    // Harusnya gk pernah bisa ke trigger
    toast.error("You need to be logged in to apply!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
