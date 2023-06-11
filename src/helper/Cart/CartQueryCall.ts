import {
  BE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CartQueryRequest,
  CartQueryResult,
} from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const CartQuery = async ({
  pageNumber,
  numberOfItems,
}: CartQueryRequest) => {
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

    const result = await PostCall<CartQueryResult>({
      url: BE_URL + "/cart/query",
      config: config,
      body: {
        pageNumber: pageNumber,
        numberOfItem: numberOfItems,
      },
    });

    if (result?.resultContext.success) {
      return result;
    } else {
      toast.error(
        "An Error Occured when fetching Cart data, please try again later.",
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          theme: "colored",
        }
      );
    }
  } else {
    toast.error("You need to be logged in to query Cart!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
