import {
  CLIENT_ID,
  CLIENT_SECRET,
  CartAddRequest,
  CartAddResult,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CartAdd = async ({ itemId, quantity }: CartAddRequest) => {
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

    const result = await PostCall<CartAddResult>({
      url: "http://localhost:8080/cart/add",
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
        "An Error Occured while adding item to cart, please try again later.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to add items to cart!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
