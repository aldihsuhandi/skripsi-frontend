import {
  CLIENT_ID,
  CLIENT_SECRET,
  ItemUpdateRequest,
  ItemUpdateResult,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const ItemUpdate = async ({
  itemId,
  itemUpdateContext,
}: ItemUpdateRequest) => {
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

    const result = await PostCall<ItemUpdateResult>({
      url: "http://localhost:8080/item/update",
      config: config,
      body: {
        itemId: itemId,
        itemUpdateContext: itemUpdateContext,
      },
    });
    console.log(result);
    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when updating the item, please try again.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to update items!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
