import axios from "axios";

import { WishlistAddResult } from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { CheckExistSessionLocal } from "../SessionHelper";
import { toast } from "react-toastify";

export const WishlistAdd = async ({ itemId }: { itemId: string }) => {
  try {
    // Check klo ada gk session local
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
        "http://localhost:8080/item/wishlist/add",
        {
          itemId,
        },
        {
          headers: headers,
        }
      );

      return data;
    } else {
      toast.error("You need to be logged in to add items to your wishlist!", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        theme: "colored",
      });
      return undefined;
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
