import {
  BE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CartUpdateRequest,
  CartUpdateResult,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CartUpdate = async ({ itemId, quantity }: CartUpdateRequest) => {
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

    const result = await PostCall<CartUpdateResult>({
      url: BE_URL + "/cart/update",
      config: config,
      body: {
        itemId,
        quantity,
      },
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when updating Cart data, please try again later.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to use the Cart!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
