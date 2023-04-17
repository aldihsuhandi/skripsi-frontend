import axios from "axios";

import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { ActivateRequest, ActivateResult } from "@/types/User";

export const ActivateCall = async (data_Activate: ActivateRequest) => {
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
};
