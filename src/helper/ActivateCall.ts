import axios from "axios";

import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ActivateRequest, ActivateResult } from "@/types/User";
import { toast } from "react-toastify";

export const ActivateCall = async (data_Activate: ActivateRequest) => {
  try {
    const { data } = await axios.post<ActivateResult>(
      "http://localhost:8080/user/activate",
      data_Activate,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          "Content-Type": "application/json",
          "Accept-Type": "application/json",
        },
      }
    );

    return data;
  } catch (e) {
    toast.error("Unable to Connect to database, please try again later", {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      theme: "colored",
    });
  }
};
