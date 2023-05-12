import axios from "axios";

import { WishlistAddResult } from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal, CheckSessionValid } from "../SessionHelper";
import { toast } from "react-toastify";

export const WishlistRemove = async ({ itemId }: { itemId: string }) => {
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

      const { data } = await axios.post<WishlistAddResult>(
        "http://localhost:8080/item/wishlist/remove",
        {
          itemId,
        },
        {
          headers: headers,
        }
      );

      return data;
    }
  } catch (error) {
    toast.error("The System is busy, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
