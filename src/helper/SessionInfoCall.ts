import axios from "axios";

import { SessionInfoRequest, SessionInfoResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const SessionInfoCall = async (sessionIdData: SessionInfoRequest) => {
  try {
    const { data } = await axios.post<SessionInfoResult>(
      "http://localhost:8080/session/info",
      sessionIdData,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          sessionId: sessionIdData.sessionId,
          "Content-Type": "application/json",
          "Accept-Type": "application/json",
        },
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
