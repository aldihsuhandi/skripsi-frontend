import { BE_URL, CLIENT_ID, CLIENT_SECRET, WishlistAddResult } from "@/types";
import { toast } from "react-toastify";
import { PostCall } from "../PostCall";
import { CheckExistSessionLocal } from "../SessionHelper";

export const WishlistAdd = async ({ itemId }: { itemId: string }) => {
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

    const result = await PostCall<WishlistAddResult>({
      url: BE_URL + "/item/wishlist/add",
      config: config,
      body: {
        itemId,
      },
    });

    return result;
  } else {
    toast.error("You need to be logged in to add items to your wishlist!", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
    return undefined;
  }
};
