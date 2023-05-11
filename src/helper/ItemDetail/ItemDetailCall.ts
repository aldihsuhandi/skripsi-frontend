import axios from "axios";

import {
  ItemDetailRequest,
  ItemDetailResult,
  Session_Local_Key,
} from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const ItemDetail = async (itemId: ItemDetailRequest) => {
  try {
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

    const { data } = await axios.post<ItemDetailResult>(
      "http://localhost:8080/item/query/detail",
      itemId,
      {
        headers: headers,
      }
    );

    return data;
  } catch (e) {
    toast.error("The System is busy, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
