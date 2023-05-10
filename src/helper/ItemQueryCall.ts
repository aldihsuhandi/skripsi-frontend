import axios from "axios";

import { ItemFilterContext, ItemQueryResult, Session_Local_Key } from "@/types";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const ItemQuery = async (itemFilterContext: ItemFilterContext) => {
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

    const { data } = await axios.post<ItemQueryResult>(
      "http://localhost:8080/item/query",
      {
        itemFilterContext,
      },
      {
        headers: headers,
      }
    );

    return data;
  } catch (error) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
