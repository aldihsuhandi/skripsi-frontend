import axios from "axios";

import { LogoutRequest, LogoutResult } from "@/types/User";
import { CLIENT_ID, CLIENT_SECRET } from "@/types";
import { toast } from "react-toastify";

export const LogoutCall = async (session: LogoutRequest) => {
  try {
    const { data } = await axios.post<LogoutResult>(
      "http://localhost:8080/session/logout",
      session,
      {
        headers: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          sessionId: session.sessionId,
          "Content-Type": "application/json",
          "Accept-Type": "application/json",
        },
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
